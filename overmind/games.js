const { gql, PubSub, withFilter} = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const {Game, GamePlayerScore} = require("./models");

const GAMES_UPDATED = 'GAMES_UPDATED';
const REPORT_CHECKLIST_UPDATED = 'REPORT_CHECKLIST_UPDATED';
const GAME_SCORE_UPDATED = 'GAME_SCORE_UPDATED';

function genId() {
  min = Math.ceil(0);
  max = Math.floor(256);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Report Items
let scoringTimer = null;
let reportCheckListCache = {};
let reportBasicScoreCache = {};
let reportTeamScoreCache = {};

/*
 * Boot up persistence layer
 */
let sequelize = null;
const initialize = (db) => {
  sequelize = db;
}

const handlers = {};
const addHandler = (id, name, method) => {
  handlers[name] = method;
}

// Private PUBSUB for Arbiters
const pubsub = new PubSub();

const reportItemKey = (item) => {
  return item.gameId + ":"
    + item.ltGameId + ":"
    + item.ltTeamId + ":"
    + item.ltPlayerId + ":"
    + (item.ltTagTeamId == null ? "" : item.ltTagTeamId);
}

const getReportItemList = () => {
  return Object.keys(reportCheckListCache).sort().map((key) => reportCheckListCache[key]);
}

const finalizeScore = () => {
  if(scoringTimer) {
    clearTimeout(scoringTimer);
    scoringTimer = null;
  }

  const ltTagsGiven = {};

  // For now we'll skip doing ultra detailed who shot who reports
  for (const key in reportTeamScoreCache) {
    const value = reportTeamScoreCache[key];
    const teamId = value.ltTagTeamId;
    value.tags.forEach((tags, playerId) => {
      const id = teamId + ":" + playerId; 
      if (ltTagsGiven[id] == null) {
        ltTagsGiven[id] = 0;
      }
      ltTagsGiven[id] += tags;
    });
  }

  let gameId = null;
  const finalScore = [];
  const created = [];
  for (const key in reportBasicScoreCache) {
    const value = reportBasicScoreCache[key];
    const id = value.ltTeamId + ":" + value.ltPlayerId;
    gameId = value.gameId;
    const score = {
      gameId: value.gameId,
      ltGameId: value.ltGameId,
      ltTeamId: value.ltTeamId,
      ltPlayerId: value.ltPlayerId,
      zoneTimeSec: value.zoneTimeSec,
      survivedTimeSec: value.survivedTimeSec,
      totalTagsReceived: value.tagsReceived,
      totalTagsGiven: ltTagsGiven[id] || 0,
    };
    finalScore.push(score);
    created.push(GamePlayerScore.create(score)); 
  }

  Promise.all(created).then(() => {
    console.info("FINISHED RECORDING SCORES");
    GamePlayerScore.findAll({
      where: {gameId: gameId}
    }).then((scores) => {
      console.info("PUBLISHING SCORES");
      pubsub.publish(GAME_SCORE_UPDATED, {
        game_id: gameId,
        game_score: scores, 
      });
    });
  });

  if (handlers.onFinalScore) {
    handlers.onFinalScore(finalScore);
  }
}

const checkAndFinalizeScore = () => {
  // We'll trigger this every time we get a report
  // if done, we'll finish up.  If not, we'll exit
  for (const key in reportCheckListCache){
    if (reportCheckListCache.hasOwnProperty(key)){
      if (reportCheckListCache[key].status !== 'COMPLETE') {
        return;
      }
    }
  }

  finalizeScore();
}

/*
 * We will need to refactor this later to support
 * multiple games simultaneously later.
 */
const scoreGame = (reportItems, timeLimitMs) => {
  scoringTimer = setTimeout(() => {
    console.warn("REACHED TIMEOUT, TALLYING SCORE ANYWAY");
    finalizeScore(); 
  }, timeLimitMs);

  reportCheckListCache = {};
  reportBasicScoreCache = {};
  reportTeamScoreCache = {};

  reportItems.forEach((item) => {
    const key = reportItemKey(item);
    reportCheckListCache[key] = {
      gameId: item.gameId,
      ltGameId: item.ltGameId,
      ltTeamId: item.ltTeamId,
      ltPlayerId: item.ltPlayerId,
      ltTagTeamId: null,
      type: 'BASIC',
      status: 'PENDING'
    };
  });

  pubsub.publish(REPORT_CHECKLIST_UPDATED, {
    report_check_list: getReportItemList()
  });
};


// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
enum GameStatus {
  SETUP
  REGISTRATION
  RUNNING
  SCORING
  COMPLETE
}

input GameSettings {
  countDownSec: Int
  gameLengthInMin: Int
  health: Int
  reloads: Int
  shields: Int
  megatags: Int
  totalTeams: Int
  options: [String]
}

input TeamTagReport {
    gameId: ID!
    ltGameId: ID!
    ltTeamId: ID!
    ltPlayerId: ID!
    ltTagTeamId: ID!
    tags: [Int]
}

input BasicTagReport {
    gameId: ID!
    ltGameId: ID!
    ltTeamId: ID!
    ltPlayerId: ID!
    zoneTimeSec: Int!
    survivedTimeSec: Int!
    tagsReceived: Int!
    followUpReports: [ID]
}

enum ReportType {
  TEAM
  BASIC
}

enum ReportStatusType {
  PENDING
  COMPLETE
}

type ReportCheckListItem {
  gameId: ID!
  ltGameId: ID!
  ltTeamId: ID!
  ltPlayerId: ID!
  ltTagTeamId: ID
  type: ReportType!
  status: ReportStatusType!
}

type Game {
  id: ID!
    ltId: ID!
    name: String
  status: GameStatus!
}

type Player {
  id: ID!
}

type GamePlayerScore {
  id: ID!
  gameId: ID!
  teamId: ID
  playerId: ID
  totalTagsReceived: Int!
  totalTagsGiven: Int!
  survivedTimeSec: Int!
  zoneTimeSec: Int!
  ltGameId: ID!
  ltTeamId: ID!
  ltPlayerId: ID!
}

type Query {
  game_score(id: ID!): [GamePlayerScore]
  games_list: [Game]
  game(id: ID!): Game
}

type Subscription {
  game_score(id: ID!): [GamePlayerScore]
  report_check_list: [ReportCheckListItem]
  games_list: [Game]
}

type Mutation {
  file_basic_tag_report(report: BasicTagReport!): Game
  file_team_tag_report(report: TeamTagReport!): Game
  joined_player(id: ID!, totemId: ID): Player!
  create_game(name: String): Game
  update_game_settings(id: ID!, settings: GameSettings!): Game
  start_game(id: ID!): Game
  start_registration(id: ID!): Game
}
`;

const resolvers = {
  Query: {
    game_score: async (root, args, context) => {
      return await GamePlayerScore.findAll({
        where: {gameId: args.id}
      });
    },
    games_list: async (root, args, context) => {
      return await Game.findAll();
    },
    game: async (root, args, context) => {
      return await Game.findByPk(args.id);
    },
  },

  Mutation: {
    file_basic_tag_report: async (root, args, context) => {
      console.warn('GOT BASIC REPORT');
      //console.warn(args.report)
      // DO SOMETHING W/ THE REPORT

      const key = reportItemKey(args.report);
      const followUpReports = args.report.followUpReports || [];
      reportBasicScoreCache[key] = args.report;

      item = reportCheckListCache[key];
      if (reportCheckListCache[key]) {
        item.status = 'COMPLETE';

        followUpReports.forEach((followUp) => {
          const followUpKey = reportItemKey({
            ...args.report,
            ltTagTeamId: followUp
          });
          console.warn('ADDING FOLLOW UP: ' + followUpKey);
          if (reportCheckListCache[followUpKey] == null) {
            reportCheckListCache[followUpKey] = {
              gameId: args.report.gameId,
              ltGameId: args.report.ltGameId,
              ltTeamId: args.report.ltTeamId,
              ltPlayerId: args.report.ltPlayerId,
              ltTagTeamId: followUp,
              type: 'TEAM',
              status: 'PENDING'
            };
          }
        });

        pubsub.publish(REPORT_CHECKLIST_UPDATED, {
          report_check_list: getReportItemList()
        });
      } else {
        console.warn('RECEIVED UNSOLICITED REPORT: ' + key);
      }

      checkAndFinalizeScore();
      return null;
    },
    file_team_tag_report: async (root, args, context) => {
      console.warn('GOT TAG REPORT');
      // DO SOMETHING W/ THE REPORT
      
      //console.warn(args.report)
      const report = args.report;

      const key = reportItemKey(report);
      reportTeamScoreCache[key] = args.report;

      item = reportCheckListCache[key];
      if (item) {
        item.status = 'COMPLETE'
      } else {
        console.warn('RECEIVED EARLY REPORT: ' + key);
        reportCheckListCache[key] = {
          gameId: args.report.gameId,
          ltGameId: args.report.ltGameId,
          ltTeamId: args.report.ltTeamId,
          ltPlayerId: args.report.ltPlayerId,
          ltTagTeamId: args.report.ltTagTeamId,
          type: 'TEAM',
          status: 'COMPLETE'
        };
      }

      pubsub.publish(REPORT_CHECKLIST_UPDATED, {
        report_check_list: getReportItemList()
      });

      checkAndFinalizeScore();
      return null;
    },
    create_game: async (root, args, context) => {
      const game = await Game.create({
        'status': 'SETUP',
        'ltId': genId(),
        'name': args.name || 'Game On!',
      });

      if (handlers.onGameCreated) {
        handlers.onGameCreated(game);
      }

      return game;
    },
    update_game_settings: async (root, args, context) => {
      const game = await Game.findByPk(args.id);
      if (handlers.onGameSettingsUpdate) {
        handlers.onGameSettingsUpdate(args.id, args.settings);
      }
      return game;
    },
    start_game: async (root, args, context) => {
      const game = await Game.findByPk(args.id);
      if (handlers.onGameStart) {
        handlers.onGameStart(args.id);
      }
      return game;
    },
    start_registration: async (root, args, context) => {
      if (handlers.onRegistrationStart) {
        handlers.onRegistrationStart(args.id);
      }
    },
    joined_player: async (root, args, context) => {
      if (handlers.onPlayerJoined) {
        handlers.onPlayerJoined(args.id, args.totemId);
      }
      return { id: args.id };
    },
  },

  Subscription: {
    game_score: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GAME_SCORE_UPDATED),
        (payload, variables) => {
          return payload.game_id === variables.id;
        }
      )
    },
    report_check_list: {
      subscribe: () => pubsub.asyncIterator([REPORT_CHECKLIST_UPDATED])
    },
    games_list: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GAMES_UPDATED),
        (payload, variables) => {
          return payload.arbiter_settings_updated.id === variables.id;
        }
      )
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

module.exports = {
  scoreGame,
  addHandler,
  initialize,
  typeDefs,
  resolvers,
  schema,
};

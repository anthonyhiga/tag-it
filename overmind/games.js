/*
 *
 * Game Infrastructure
 *
 */
const { gql, PubSub, withFilter} = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const {Game, GamePlayerScore} = require("./models");
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const PLAYERS_UPDATED = 'PLAYERS_UPDATED';
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
let finalizingScore = false;

/*
 * Boot up persistence layer
 */
let sequelize = null;
const initialize = (db) => {
  sequelize = db;
};

const gameMachineCache = {}; 
const gameMachineBuilderCache = {}; 
const registerGameMachine = (machineBuilder) => {
  gameMachineBuilderCache[machineBuilder.type] = machineBuilder;
};

let handlers = {};
const addHandler = (id, name, method) => {
  handlers[name] = method;
}

const removeHandlers = (id) => {
  handlers = {};
};

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

const cleanUpOldGames = () => {
  Game.findAll({where: {
    status: {
      [Op.ne]: 'COMPLETE'
    }
  }}).then((games) => {
    games.forEach((game) => {
      game.status = 'COMPLETE';
      game.completedAt = new Date();
      game.save();
    });
  });
}

let gameSettings = {};
const updateGameSettings = (settings) => {
  console.warn('UPDATED SETTINGS');
  gameSettings = settings;
}

let playersCache = [];
const updatePlayers = (players) => {
  playersCache = players;

  pubsub.publish(PLAYERS_UPDATED, {
    active_players_list: playersCache,
  });
}

const updateGameState = (id, status) => {
  return Game.findByPk(id).then(game => {
    if (game != null) {
      game.status = status;
      if (status === "RUNNING") {
        game.startedAt = new Date();
      }
      if (status === "AWARDS") {
        game.completedAt = new Date();
      }
      return game.save();
    }

    return game;
  }).then(() => {
      return Promise.all([
        Game.findAll(),
        Game.findAll({where: {
          status: {
            [Op.ne]: 'COMPLETE'
          }
        }})
      ]).then((results) => {
        console.log('GAME STATE ID: ' + id + ' STATUS: ' + status);
        pubsub.publish(GAMES_UPDATED, {
          games_list: results[0],
          active_games_list: results[1], 
        });
      });
  });
};

const finalizeScore = () => {
  if (finalizingScore) {
    return;
  }

  finalizingScore = true;

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
      where: { gameId: gameId }
    }).then((scores) => {
      console.info("PUBLISHING SCORES");
      pubsub.publish(GAME_SCORE_UPDATED, {
        game_id: gameId,
        game_score: scores,
      });

      if (handlers.onFinalScore) {
        handlers.onFinalScore(finalScore);

        reportCheckListCache = {};
        reportBasicScoreCache = {};
        reportTeamScoreCache = {};

        pubsub.publish(REPORT_CHECKLIST_UPDATED, {
          report_check_list: getReportItemList()
        });
      }
    });
  });
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

  finalizingScore = false;
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

  setInterval(() => {
    pubsub.publish(REPORT_CHECKLIST_UPDATED, {
      report_check_list: getReportItemList()
    });
  }, 2000);
};

const forceSubscriptionUpdate = () => { 
  Promise.all([
    Game.findAll(),
    Game.findAll({where: {
      status: {
        [Op.ne]: 'COMPLETE'
      }
    }})
  ]).then((results) => {
    pubsub.publish(GAMES_UPDATED, {
      games_list: results[0],
      active_games_list: results[1], 
    });
    pubsub.publish(PLAYERS_UPDATED, {
      active_players_list: playersCache,
    });
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
  AWARDS
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

type GameType {
  name: String!
  type: String!
  description: String!
  iconUrl: String!
}

type Game {
  id: ID!
    ltId: ID!
    name: String
  status: GameStatus!
  completedAt: String
  startedAt: String
}

type CurrentGameSettings {
  countDownSec: Int
  gameLengthInMin: Int
  health: Int
  reloads: Int
  shields: Int
  megatags: Int
  totalTeams: Int
  options: [String]
}

enum PlayerStatus {
  IDLE 
  JOINING 
  ACTIVE 
}

type Player {
  id: ID!
  status: PlayerStatus!
  ltTeamId: ID
  ltPlayerId: ID
  name: String
  totemId: ID!
  avatarUrl: String!
  iconUrl: String!
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
  game_types_list: [GameType]
  game_score(id: ID!): [GamePlayerScore]
  games_list: [Game]
  game(id: ID!): Game
  active_games_list: [Game]
  game_settings(id: ID!): CurrentGameSettings
}

type Subscription {
  game_score(id: ID!): [GamePlayerScore]
  report_check_list: [ReportCheckListItem]
  games_list: [Game]
  active_games_list: [Game]
  active_players_list: [Player]
}

type Mutation {
  file_basic_tag_report(report: BasicTagReport!): Game
  file_team_tag_report(report: TeamTagReport!): Game
  joined_player(id: ID!, totemId: ID): Player!

  create_game(type: String!, name: String): Game
  end_game(id: ID!): Game

  update_game_settings(id: ID!, settings: GameSettings!): Game
  start_game(id: ID!): Game
  start_registration(id: ID!): Game
}
`;

const resolvers = {
  Query: {
    game_types_list: async (root, args, context) => {
      return Object.keys(gameMachineBuilderCache).map((key) => {
        const value = gameMachineBuilderCache[key];
        return {
          type: key,
          description: value.description, 
          name: value.name,
          iconUrl: value.iconUrl,
        };
      });
    },
    game_settings: async (root, args, context) => {
      return gameSettings;
    },
    game_score: async (root, args, context) => {
      return await GamePlayerScore.findAll({
        where: {gameId: args.id}
      });
    },
    games_list: async (root, args, context) => {
      return await Game.findAll();
    },
    active_games_list: async (root, args, context) => {
      return await Game.findAll({where: {
        status: {
          [Op.ne]: 'COMPLETE'
        }
      }});
    },
    game: async (root, args, context) => {
      return await Game.findByPk(args.id);
    },
  },

  Mutation: {
    file_basic_tag_report: async (root, args, context) => {
      // This is coming from the arbiter 
      //console.warn(args.report)

      const key = reportItemKey(args.report);
      console.warn('GOT BASIC REPORT: ' + key); 
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
          if (reportCheckListCache[followUpKey] == null) {
            console.warn('ADDING FOLLOW UP: ' + followUpKey);
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
      // This is coming from the arbiter 
      
      //console.warn(args.report)
      const report = args.report;

      const key = reportItemKey(report);
      console.warn('GOT TAG REPORT: ' + key); 
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
      // This is coming from a client
      if (gameMachineBuilderCache[args.type] == null) {
        console.warn("NO MACHINE REGISTERED FOR TYPE: " + args.type);
        return null;
      }

      const game = await Game.create({
        'status': 'SETUP',
        'ltId': genId(),
        'name': args.name || 'Game On!',
      });

      const machine = gameMachineBuilderCache[args.type].build(game);
      gameMachineCache[game.id] = machine;

      console.log("CREATING GAME: " + game.id);

      Promise.all([
        Game.findAll(),
        Game.findAll({where: {
          status: {
            [Op.ne]: 'COMPLETE'
          }
        }})
      ]).then((results) => {
        pubsub.publish(GAMES_UPDATED, {
          games_list: results[0],
          active_games_list: results[1], 
        });
      });

      return game;
    },
    update_game_settings: async (root, args, context) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].updateSettings(args.settings);
      } else {
        console.warn("CANNOT UPDATE GAME SETTINGS: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    start_game: async (root, args, context) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].startGame();
      } else {
        console.warn("CANNOT START GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    end_game: async (root, args, context) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].endGame();
        delete gameMachineCache[gameId];
        console.log("CLEARING GAME MACHINE");
      } else {
        console.warn("CANNOT END GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    start_registration: async (root, args, context) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].startRegistration();
      } else {
        console.warn("CANNOT START REGISTRATION FOR GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    joined_player: async (root, args, context) => {
      // This is coming from the arbiter
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
      subscribe: () => pubsub.asyncIterator([GAMES_UPDATED])
    },
    active_games_list: {
      subscribe: () => pubsub.asyncIterator([GAMES_UPDATED])
    },
    active_players_list: {
      subscribe: () => pubsub.asyncIterator([PLAYERS_UPDATED])
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

module.exports = {
  updateGameSettings,
  updatePlayers,
  forceSubscriptionUpdate,
  cleanUpOldGames,
  registerGameMachine,
  updateGameState,
  scoreGame,
  addHandler,
  removeHandlers,
  initialize,
  typeDefs,
  resolvers,
  schema,
};

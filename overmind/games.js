const { gql, PubSub, withFilter} = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const {Game} = require("./models");

const GAMES_UPDATED = 'GAMES_UPDATED';
const REPORT_CHECKLIST_UPDATED = 'REPORT_CHECKLIST_UPDATED';

function genId() {
  min = Math.ceil(0);
  max = Math.floor(256);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Report Items
const reportCheckListCache = [];

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
  return item.ltGameId + ":"
    + item.ltTeamId + ":"
    + item.ltPlayerId + ":"
    + (item.ltTagTeamId == null ? "" : item.ltTagTeamId);
}

const getReportItemList = () => {
  return Object.keys(reportCheckListCache).sort().map((key) => reportCheckListCache[key]);
}

const scoreGame = (reportItems) => {
  for (const key in reportCheckListCache){
    if (reportCheckListCache.hasOwnProperty(key)){
      delete reportCheckListCache[key];
    }
  }

  reportItems.forEach((item) => {
    const key = reportItemKey(item);
    reportCheckListCache[key] = {
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

const addBasicReport = (report) => {
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
  ltGameId: ID!
    ltTeamId: ID!
    ltPlayerId: ID!
    ltTagTeamId: ID!
    tags: [Int]
}

input BasicTagReport {
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

type Query {
  games_list: [Game]
  game(id: ID!): Game
}

type Subscription {
  report_check_list: [ReportCheckListItem]
  games_list: [Game]
}

type Mutation {
  file_basic_tag_report(report: BasicTagReport!): Game
  file_team_tag_report(report: TeamTagReport!): Game
  joined_player(id: ID!, totemId: ID): Player!
    score_game(id: ID!): Game
  create_game(name: String): Game
  update_game_settings(id: ID!, settings: GameSettings!): Game
  start_game(id: ID!): Game
  start_registration(id: ID!): Game
}
`;

const resolvers = {
  Query: {
    games_list: async (root, args, context) => {
      return await Game.findAll();
    },
    game: async (root, args, context) => {
      return await Game.findByPk(args.id);
    },
  },

  Mutation: {
    file_basic_tag_report: async (root, args, context) => {
      const game = await Game.findByPk(args.id);
      console.warn('GOT BASIC REPORT');
      console.warn(args.report)
      // DO SOMETHING W/ THE REPORT

      const key = reportItemKey(args.report);
      const followUpReports = args.report.followUpReports;

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
      return game;
    },
    file_team_tag_report: async (root, args, context) => {
      console.warn('GOT TAG REPORT');
      // DO SOMETHING W/ THE REPORT
      
      console.warn(args.report)
      const report = args.report;

      const key = reportItemKey(report);
      item = reportCheckListCache[key];
      if (item) {
        item.status = 'COMPLETE'
      } else {
        console.warn('RECEIVED UNSOLICITED REPORT: ' + key);
      }

      pubsub.publish(REPORT_CHECKLIST_UPDATED, {
        report_check_list: getReportItemList()
      });
    },
    score_game: async (root, args, context) => {
      const game = await Game.findByPk(args.id);
      scoreGame([
        {
          ltGameId: 1,
          ltTeamId: 1,
          ltPlayerId: 0,
        },
        {
          ltGameId: 1,
          ltTeamId: 2,
          ltPlayerId: 0,
        }
      ]);
      return game;
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

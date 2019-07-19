/*
 *
 * Game Infrastructure
 *
 */
import "graphql-import-node";

import * as typeDefs from "./schema/games.graphql";

import { Op } from "sequelize";
import { PubSub, withFilter } from "apollo-server";

import { makeExecutableSchema } from "graphql-tools";
import { GamePlayer } from './base-types';

const { Game, GamePlayerScore } = require("./models");

const PLAYERS_UPDATED = "PLAYERS_UPDATED";
const GAMES_UPDATED = "GAMES_UPDATED";
const SETTINGS_UPDATED = "SETTINGS_UPDATED";
const REPORT_CHECKLIST_UPDATED = "REPORT_CHECKLIST_UPDATED";
const GAME_SCORE_UPDATED = "GAME_SCORE_UPDATED";

function genId() {
  const min = Math.ceil(0);
  const max = Math.floor(256);
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

const gameMachineCache = {};
const gameMachineBuilderCache = {};
const registerGameMachine = machineBuilder => {
  gameMachineBuilderCache[machineBuilder.type] = machineBuilder;
};

let handlers = {};
const addHandler = (id, name, method) => {
  handlers[name] = method;
};

const removeHandlers = id => {
  handlers = {};
};

// Private PUBSUB for Arbiters
const pubsub = new PubSub();

const reportItemKey = item => {
  return (
    item.gameId +
    ":" +
    item.ltGameId +
    ":" +
    item.ltTeamId +
    ":" +
    item.ltPlayerId +
    ":" +
    (item.ltTagTeamId == null ? "" : item.ltTagTeamId)
  );
};

const getReportItemList = () => {
  return Object.keys(reportCheckListCache)
    .sort()
    .map(key => reportCheckListCache[key]);
};

const cleanUpOldGames = () => {
  Game.findAll({
    where: {
      status: {
        [Op.ne]: "COMPLETE"
      }
    }
  }).then(games => {
    games.forEach(game => {
      game.status = "COMPLETE";
      game.completedAt = new Date();
      game.save();
    });
  });
};

let gameSettings = {};
const updateGameSettings = settings => {
  console.warn("UPDATED SETTINGS");
  gameSettings = settings;
};

let playersCache: GamePlayer[] = [];
const updatePlayers = (players: GamePlayer[]) => {
  playersCache = players;

  pubsub.publish(PLAYERS_UPDATED, {
    active_players_list: playersCache
  });
};

const updateGameState = (id: number, status: string) => {
  return Game.findByPk(id)
    .then(game => {
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
    })
    .then(() => {
      return Promise.all([
        Game.findAll(),
        Game.findAll({
          where: {
            status: {
              [Op.ne]: "COMPLETE"
            }
          }
        })
      ]).then(results => {
        console.log("GAME STATE ID: " + id + " STATUS: " + status);
        pubsub.publish(GAMES_UPDATED, {
          games_list: results[0],
          active_games_list: results[1]
        });
      });
    });
};

const finalizeScore = () => {
  if (finalizingScore) {
    return;
  }

  finalizingScore = true;

  if (scoringTimer) {
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

  let gameId: number | null = null;
  const finalScore = [];
  const created = [];
  for (const key in reportBasicScoreCache) {
    const value = reportBasicScoreCache[key];
    const id = value.ltTeamId + ":" + value.ltPlayerId;
    gameId = value.gameId;
    let playerId = null;
    for (const playerIndex in playersCache) {
      const player = playersCache[playerIndex];
      if (
        player.ltTeamId == value.ltTeamId &&
        player.ltPlayerId == value.ltPlayerId
      ) {
        playerId = player.id;
      }
    }

    const score = {
      gameId: value.gameId,
      playerId: playerId,
      ltGameId: value.ltGameId,
      ltTeamId: value.ltTeamId,
      ltPlayerId: value.ltPlayerId,
      zoneTimeSec: value.zoneTimeSec,
      survivedTimeSec: value.survivedTimeSec,
      totalTagsReceived: value.tagsReceived,
      totalTagsGiven: ltTagsGiven[id] || 0
    };
    finalScore.push(score);
    created.push(GamePlayerScore.create(score));
  }

  Promise.all(created).then(() => {
    console.info("FINISHED RECORDING SCORES");
    GamePlayerScore.findAll({
      where: { gameId: gameId }
    }).then(scores => {
      console.info("PUBLISHING SCORES");
      pubsub.publish(GAME_SCORE_UPDATED, {
        game_id: gameId,
        game_score: scores
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
};

const checkAndFinalizeScore = () => {
  // We'll trigger this every time we get a report
  // if done, we'll finish up.  If not, we'll exit
  for (const key in reportCheckListCache) {
    if (reportCheckListCache.hasOwnProperty(key)) {
      if (reportCheckListCache[key].status !== "COMPLETE") {
        return;
      }
    }
  }

  finalizeScore();
};

/*
 * We will need to refactor this later to support
 * multiple games simultaneously later.
 */
const scoreGame = (reportItems, timeLimitMs: number) => {
  scoringTimer = setTimeout(() => {
    console.warn("REACHED TIMEOUT, TALLYING SCORE ANYWAY");
    finalizeScore();
  }, timeLimitMs);

  finalizingScore = false;
  reportCheckListCache = {};
  reportBasicScoreCache = {};
  reportTeamScoreCache = {};

  reportItems.forEach(item => {
    const key = reportItemKey(item);
    reportCheckListCache[key] = {
      gameId: item.gameId,
      ltGameId: item.ltGameId,
      ltTeamId: item.ltTeamId,
      ltPlayerId: item.ltPlayerId,
      ltTagTeamId: null,
      type: "BASIC",
      status: "PENDING"
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
    Game.findAll({
      where: {
        status: {
          [Op.ne]: "COMPLETE"
        }
      }
    })
  ]).then(results => {
    pubsub.publish(GAMES_UPDATED, {
      games_list: results[0],
      active_games_list: results[1]
    });
    pubsub.publish(PLAYERS_UPDATED, {
      active_players_list: playersCache
    });
    pubsub.publish(SETTINGS_UPDATED, {
      game_settings: gameSettings
    });
  });
};

const resolvers = {
  Query: {
    game_types_list: async () => {
      return Object.keys(gameMachineBuilderCache).map(key => {
        const value = gameMachineBuilderCache[key];
        return {
          type: key,
          description: value.description,
          name: value.name,
          iconUrl: value.iconUrl
        };
      });
    },
    game_settings: async () => {
      return gameSettings;
    },
    game_score: async (root, args) => {
      return await GamePlayerScore.findAll({
        where: { gameId: args.id }
      });
    },
    games_list: async () => {
      return await Game.findAll();
    },
    game_players_list: async () => {
      // For now we'll return the active cache
      return playersCache;
    },
    active_games_list: async () => {
      return await Game.findAll({
        where: {
          status: {
            [Op.ne]: "COMPLETE"
          }
        }
      });
    },
    game: async (root, args) => {
      return await Game.findByPk(args.id);
    }
  },

  Mutation: {
    file_basic_tag_report: async (root, args) => {
      // This is coming from the arbiter
      //console.warn(args.report)

      const key = reportItemKey(args.report);
      console.warn("GOT BASIC REPORT: " + key);
      const followUpReports = args.report.followUpReports || [];
      reportBasicScoreCache[key] = args.report;

      const item = reportCheckListCache[key];
      if (reportCheckListCache[key]) {
        item.status = "COMPLETE";

        followUpReports.forEach(followUp => {
          const followUpKey = reportItemKey({
            ...args.report,
            ltTagTeamId: followUp
          });
          if (reportCheckListCache[followUpKey] == null) {
            console.warn("ADDING FOLLOW UP: " + followUpKey);
            reportCheckListCache[followUpKey] = {
              gameId: args.report.gameId,
              ltGameId: args.report.ltGameId,
              ltTeamId: args.report.ltTeamId,
              ltPlayerId: args.report.ltPlayerId,
              ltTagTeamId: followUp,
              type: "TEAM",
              status: "PENDING"
            };
          }
        });

        pubsub.publish(REPORT_CHECKLIST_UPDATED, {
          report_check_list: getReportItemList()
        });
      } else {
        console.warn("RECEIVED UNSOLICITED REPORT: " + key);
      }

      checkAndFinalizeScore();
      return null;
    },
    file_team_tag_report: async (root, args) => {
      // This is coming from the arbiter

      //console.warn(args.report)
      const report = args.report;

      const key = reportItemKey(report);
      console.warn("GOT TAG REPORT: " + key);
      reportTeamScoreCache[key] = args.report;

      const item = reportCheckListCache[key];
      if (item) {
        item.status = "COMPLETE";
      } else {
        console.warn("RECEIVED EARLY REPORT: " + key);
        reportCheckListCache[key] = {
          gameId: args.report.gameId,
          ltGameId: args.report.ltGameId,
          ltTeamId: args.report.ltTeamId,
          ltPlayerId: args.report.ltPlayerId,
          ltTagTeamId: args.report.ltTagTeamId,
          type: "TEAM",
          status: "COMPLETE"
        };
      }

      pubsub.publish(REPORT_CHECKLIST_UPDATED, {
        report_check_list: getReportItemList()
      });

      checkAndFinalizeScore();
      return null;
    },
    create_game: async (root, args) => {
      // This is coming from a client
      if (gameMachineBuilderCache[args.type] == null) {
        console.warn("NO MACHINE REGISTERED FOR TYPE: " + args.type);
        return null;
      }

      const game = await Game.create({
        status: "SETUP",
        ltId: genId(),
        name: args.name || "Game On!"
      });

      const machine = gameMachineBuilderCache[args.type].build(game);
      gameMachineCache[game.id] = machine;

      console.log("CREATING GAME: " + game.id);

      Promise.all([
        Game.findAll(),
        Game.findAll({
          where: {
            status: {
              [Op.ne]: "COMPLETE"
            }
          }
        })
      ]).then(results => {
        pubsub.publish(GAMES_UPDATED, {
          games_list: results[0],
          active_games_list: results[1]
        });
      });

      return game;
    },
    update_game_settings: async (root, args) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].updateSettings(args.settings);
      } else {
        console.warn("CANNOT UPDATE GAME SETTINGS: " + args.id);
      }
      pubsub.publish(SETTINGS_UPDATED, {
        game_settings: gameSettings
      });
      return await Game.findByPk(args.id);
    },
    start_game: async (root, args) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].startGame();
      } else {
        console.warn("CANNOT START GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    end_game: async (root, args) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].endGame();
        delete gameMachineCache[args.id];
        console.log("CLEARING GAME MACHINE");
      } else {
        console.warn("CANNOT END GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    start_registration: async (root, args) => {
      // This is coming from a client
      if (gameMachineCache[args.id]) {
        gameMachineCache[args.id].startRegistration();
      } else {
        console.warn("CANNOT START REGISTRATION FOR GAME: " + args.id);
      }
      return await Game.findByPk(args.id);
    },
    joined_player: async (root, args) => {
      // This is coming from the arbiter
      if (handlers.onPlayerJoined) {
        handlers.onPlayerJoined(args.id, args.totemId);
      }
      return { id: args.id };
    }
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
    game_settings: {
      subscribe: () => pubsub.asyncIterator([SETTINGS_UPDATED])
    },
    games_list: {
      subscribe: () => pubsub.asyncIterator([GAMES_UPDATED])
    },
    active_games_list: {
      subscribe: () => pubsub.asyncIterator([GAMES_UPDATED])
    },
    active_players_list: {
      subscribe: () => pubsub.asyncIterator([PLAYERS_UPDATED])
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

export default {
  updateGameSettings,
  updatePlayers,
  forceSubscriptionUpdate,
  cleanUpOldGames,
  registerGameMachine,
  updateGameState,
  scoreGame,
  addHandler,
  removeHandlers,
  typeDefs,
  resolvers,
  schema
};

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
import {
  Game,
  GameMachineBuilder,
  GameState,
  GameSettings,
  SMProps,
  SMModel,
  Channel,
  DEFAULT_GAME_SETTINGS
} from "./base-types";
import arbiters from "./arbiters";
import players from "./players";
import users from "./users";
import StateMachine from "./state-machine";

const { Game, GamePlayerScore } = require("./models");

const PLAYERS_UPDATED = "PLAYERS_UPDATED";
const GAMES_UPDATED = "GAMES_UPDATED";
const SETTINGS_UPDATED = "SETTINGS_UPDATED";
const REPORT_CHECKLIST_UPDATED = "REPORT_CHECKLIST_UPDATED";
const GAME_SCORE_UPDATED = "GAME_SCORE_UPDATED";

export class GameManager {
  // Private PUBSUB for Managers
  pubsub = new PubSub();
  scoringTimer: any = null;

  // NOTE: we only support 1 active right now, but if we want to coordinate more than
  //       1, we'll have to dump the concept of an active game.
  currentGame: Game | null = null;

  constructor() {
    arbiters.setHandler("onChannelUpdated", (channel: Channel) => {
      const id = (this.currentGame && this.currentGame.id) || 0;
      if (this.gameMachineCache[id]) {
        this.gameMachineCache[id].model().onChannelUpdated(channel);
      } else {
        console.warn("GAME NOT STARTED CHANNEL UPDATE IGNORED");
      }
    });
    players.setHandler("graphql:active_players_list", () => {
      console.warn("UPDATING ACTIVE PLAYER LIST");
      this.pubsub.publish(PLAYERS_UPDATED, {
        active_players_list: {
          id: 88888888,
          items: players.getGamePlayers()
        }
      });
    });
  }

  genGameId() {
    const min = Math.ceil(0);
    const max = Math.floor(256);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  gameMachineCache: { [key: string]: StateMachine<SMProps, SMModel> } = {};
  gameMachineBuilderCache: {
    [key: string]: GameMachineBuilder<StateMachine<SMProps, SMModel>>;
  } = {};

  // External registration of game machines
  registerGameMachine = (
    machineBuilder: GameMachineBuilder<StateMachine<SMProps, SMModel>>
  ) => {
    this.gameMachineBuilderCache[machineBuilder.type] = machineBuilder;
  };

  cleanUpOldGames = () => {
    Game.findAll({
      where: {
        status: {
          [Op.ne]: "COMPLETE"
        }
      }
    }).then((games: Game[]) => {
      games.forEach((game: Game) => {
        game.status = "COMPLETE";
        game.completedAt = new Date();
        game.save();
      });
    });
  };

  gameSettings: GameSettings = { ...DEFAULT_GAME_SETTINGS };
  onUpdateGameSettings = (settings: GameSettings) => {
    console.warn("UPDATED SETTINGS");
    this.gameSettings = settings;
    this.pubsub.publish(SETTINGS_UPDATED, {
      game_settings: this.gameSettings
    });
  };

  reportCheckListCache = {};
  reportBasicScoreCache = {};
  reportTeamScoreCache = {};
  finalizingScore = false;

  reportItemKey = (item: any) => {
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

  getReportItemList = () => {
    return {
      id: 77777777,
      items:Object.keys(this.reportCheckListCache)
        .sort()
        .map(key => this.reportCheckListCache[key])
    };
  };

  updateGameState = (id: number, status: GameState) => {
    return Game.findByPk(id)
      .then((game: Game | null) => {
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
          this.pubsub.publish(GAMES_UPDATED, {
            games_list: results[0],
            active_games_list: {
              id: 99999999,
              items: results[1]
	    }
          });
          this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
            report_check_list: this.getReportItemList()
          });
        });
      });
  };

  // Report Items
  finalizeScore = () => {
    if (this.finalizingScore) {
      return;
    }

    this.finalizingScore = true;

    if (this.scoringTimer) {
      clearTimeout(this.scoringTimer);
      this.scoringTimer = null;
    }

    const currentPlayers = {};
    const currentPlayerList = players.getGamePlayers();
    currentPlayerList.forEach(player => {
      currentPlayers[player.id] = player;
    });

    const ltTagsGiven = {};

    // For now we'll skip doing ultra detailed who shot who reports
    for (const key in this.reportTeamScoreCache) {
      const value = this.reportTeamScoreCache[key];
      const teamId = value.ltTagTeamId;
      value.tags.forEach((tags: number, playerId: number) => {
        const id = teamId + ":" + playerId;
        if (ltTagsGiven[id] == null) {
          ltTagsGiven[id] = 0;
        }
        ltTagsGiven[id] += tags;
        // console.log(id + ":" + tags);
      });
    }

    let gameId: number | null = null;
    const finalScore: any[] = [];
    const created = [];
    for (const key in this.reportBasicScoreCache) {
      const value = this.reportBasicScoreCache[key];
      const id = value.ltTeamId + ":" + value.ltPlayerId;
      gameId = value.gameId;
      let playerId = null;
      currentPlayerList.forEach(player => {
        if (
          player.ltTeamId == value.ltTeamId &&
          player.ltPlayerId == value.ltPlayerId
        ) {
          playerId = player.id;
        }
      });

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
      }).then((scores: any) => {
        console.info("PUBLISHING SCORES");
        this.pubsub.publish(GAME_SCORE_UPDATED, {
          game_id: gameId,
          game_score: scores
        });

        if (gameId && this.gameMachineCache[gameId]) {
          this.gameMachineCache[gameId]
            .model()
            .onFinalScore(finalScore)
        }

        this.reportCheckListCache = {};
        this.reportBasicScoreCache = {};
        this.reportTeamScoreCache = {};

        this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
          report_check_list: this.getReportItemList()
        });
      });
    });
  };

  checkAndFinalizeScore = () => {
    // We'll trigger this every time we get a report
    // if done, we'll finish up.  If not, we'll exit
    for (const key in this.reportCheckListCache) {
      if (this.reportCheckListCache.hasOwnProperty(key)) {
        if (this.reportCheckListCache[key].status !== "COMPLETE") {
          return;
        }
      }
    }

    this.finalizeScore();
  };

  /*
   * We will need to refactor this later to support
   * multiple games simultaneously later.
   */
  scoreGame = (reportItems: any[], timeLimitMs: number) => {
    this.scoringTimer = setTimeout(() => {
      console.warn("REACHED TIMEOUT, TALLYING SCORE ANYWAY");
      this.finalizeScore();
    }, timeLimitMs);

    this.finalizingScore = false;
    this.reportCheckListCache = {};
    this.reportBasicScoreCache = {};
    this.reportTeamScoreCache = {};

    reportItems.forEach((item: any) => {
      const key = this.reportItemKey(item);
      const {gameId, ltGameId, ltTeamId, ltPlayerId } = item;
      const player = players.getPlayerByTeamPlayerId(ltGameId, ltTeamId, ltPlayerId); 
      const user = player && users.get(player.userId);

      this.reportCheckListCache[key] = {
        gameId: gameId,
        ltGameId: ltGameId,
        ltTeamId: ltTeamId,
        ltPlayerId: ltPlayerId,
        ltTagTeamId: null,
        type: "BASIC",
        status: "PENDING",
        name: user && user.name, 
        avatarUrl: user && user.avatarUrl, 
        iconUrl: user && user.iconUrl, 
      };
    });

    this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
      report_check_list: this.getReportItemList()
    });

    setInterval(() => {
      this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
        report_check_list: this.getReportItemList()
      });
    }, 2000);
  };

  forceSubscriptionUpdate = () => {
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
      this.pubsub.publish(GAMES_UPDATED, {
        games_list: results[0],
        active_games_list: {
          id: 99999999,
          items: results[1]
	}
      });
      this.pubsub.publish(PLAYERS_UPDATED, {
        active_players_list: {
          id: 88888888,
          items: players.getGamePlayers()
        }
      });
      this.pubsub.publish(SETTINGS_UPDATED, {
        game_settings: this.gameSettings
      });
    });
  };

  createGameMutation = async (root: any, args: any) => {
    // This is coming from a client
    const builder = this.gameMachineBuilderCache[args.type];
    if (builder == null) {
      console.warn("NO MACHINE REGISTERED FOR TYPE: " + args.type);
      return {};
    }

    const game: Game = await Game.create({
      status: "SETUP",
      ltId: this.genGameId(),
      name: (args.name.length > 0 ? args.name : null) ?? builder.name ?? "Game On!"
    });

    const machine = builder.build(
      game,
      this.onUpdateGameSettings
    );
    this.gameMachineCache[game.id] = machine;

    // Clear the players cache
    players.clear();

    // Boot up this game machine
    machine.start();

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
      this.pubsub.publish(GAMES_UPDATED, {
        games_list: results[0],
        active_games_list: {
          id: 99999999,
          items: results[1]
	}
      });
    });

    this.currentGame = game;

    return game;
  };

  updateGameSettingsMutation = async (root: any, args: any) => {
    // This is coming from a client
    if (this.gameMachineCache[args.id]) {
      this.gameMachineCache[args.id]
        .model()
        .onGameSettingsUpdate(args.settings);
    } else {
      console.warn("CANNOT UPDATE GAME SETTINGS: " + args.id);
    }
    this.pubsub.publish(SETTINGS_UPDATED, {
      game_settings: this.gameSettings
    });
    return this.gameSettings;
  };

  startGameMutation = async (root: any, args: any) => {
    // This is coming from a client
    if (this.gameMachineCache[args.id]) {
      this.gameMachineCache[args.id].model().onGameStart();
    } else {
      console.warn("CANNOT START GAME: " + args.id);
    }
    return await Game.findByPk(args.id);
  };

  cancelGameMutation = async (root: any, args: any) => {
    // This is coming from a client
    if (this.gameMachineCache[args.id]) {
      delete this.gameMachineCache[args.id];
      this.reportCheckListCache = {};
      console.log("CLEARING GAME MACHINE");
      console.log("CANCEL GAME: " + args.id);
    } else {
      console.warn("CANNOT CANCEL GAME: " + args.id);
    }
    return await Game.findByPk(args.id);
  };

  endGameMutation = async (root: any, args: any) => {
    // This is coming from a client
    if (this.gameMachineCache[args.id]) {
      this.gameMachineCache[args.id].model().onGameEnd();
      delete this.gameMachineCache[args.id];
      this.reportCheckListCache = {};
      console.log("CLEARING GAME MACHINE");
      console.log("END GAME: " + args.id);
    } else {
      console.warn("CANNOT END GAME: " + args.id);
    }
    return await Game.findByPk(args.id);
  };

  startRegistrationMutation = async (root: any, args: any) => {
    // This is coming from a client
    if (this.gameMachineCache[args.id]) {
      this.gameMachineCache[args.id].model().onRegistrationStart();
    } else {
      console.warn("CANNOT START REGISTRATION FOR GAME: " + args.id);
    }
    return await Game.findByPk(args.id);
  };

  fileBasicTagReportMutation = async (root: any, args: any) => {
    // This is coming from the arbiter
    console.warn(args.report)

    const key = this.reportItemKey(args.report);
    console.warn("GOT BASIC REPORT: " + key);
    const followUpReports = args.report.followUpReports || [];
    this.reportBasicScoreCache[key] = args.report;

    const item = this.reportCheckListCache[key];
    if (this.reportCheckListCache[key]) {
      item.status = "COMPLETE";

      followUpReports.forEach((followUp: any) => {
        const followUpKey = this.reportItemKey({
          ...args.report,
          ltTagTeamId: followUp
        });
        if (this.reportCheckListCache[followUpKey] == null) {
          console.warn("ADDING FOLLOW UP: " + followUpKey);
          const {gameId, ltGameId, ltTeamId, ltPlayerId} = args.report;
          const player = players.getPlayerByTeamPlayerId(ltGameId, ltTeamId, ltPlayerId); 
          const user = player && users.get(player.userId);

          this.reportCheckListCache[followUpKey] = {
            gameId,
            ltGameId,
            ltTeamId,
            ltPlayerId,
            ltTagTeamId: followUp,
            type: "TEAM",
            status: "PENDING",
            name: user && user.name, 
            avatarUrl: user && user.avatarUrl, 
            iconUrl: user && user.iconUrl, 
          };
        }
      });

      this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
        report_check_list: this.getReportItemList()
      });
    } else {
      console.warn("RECEIVED UNSOLICITED REPORT: " + key);
    }

    this.checkAndFinalizeScore();
    const {gameId} = args.report;
    return await Game.findByPk(gameId);
  };

  fileTeamTagReport = async (root: any, args: any) => {
    // This is coming from the arbiter

    console.warn(args.report)
    const report = args.report;

    const key = this.reportItemKey(report);
    console.warn("GOT TAG REPORT: " + key);
    this.reportTeamScoreCache[key] = args.report;

    const item = this.reportCheckListCache[key];
    if (item) {
      item.status = "COMPLETE";
    } else {
      console.warn("RECEIVED EARLY REPORT: " + key);
      const {gameId, ltGameId, ltTeamId, ltPlayerId, ltTagTeamId} = args.report;
      const player = players.getPlayerByTeamPlayerId(ltGameId, ltTeamId, ltPlayerId); 
      const user = player && users.get(player.userId); 
      this.reportCheckListCache[key] = {
        gameId,
        ltGameId,
        ltTeamId,
        ltPlayerId,
        ltTagTeamId,
        type: "TEAM",
        status: "COMPLETE", 
        name: user && user.name, 
        avatarUrl: user && user.avatarUrl, 
        iconUrl: user && user.iconUrl, 
      };
    }

    this.pubsub.publish(REPORT_CHECKLIST_UPDATED, {
      report_check_list: this.getReportItemList()
    });

    this.checkAndFinalizeScore();
    const {gameId} = args.report;
    return await Game.findByPk(gameId);
  };

  joinedPlayerMutation = async (root: any, args: any) => {
    // This is coming from a the arbiter
    const id = (this.currentGame && this.currentGame.id) || 0;
    if (this.gameMachineCache[id]) {
      this.gameMachineCache[id].model().onPlayerJoined(args.id, args.totemId);
    } else {
      console.warn("CANNOT RECORD PLAYER JOINED: " + args.id);
    }
    return { id: args.id };
  };

  buildSchema = () => {
    const resolvers = {
      Query: {
        game_types_list: async () => {
          return Object.keys(this.gameMachineBuilderCache).map(key => {
            const value = this.gameMachineBuilderCache[key];
            return {
              type: key,
              description: value.description,
              name: value.name,
              iconUrl: value.iconUrl
            };
          });
        },
        game_settings: async () => {
          return this.gameSettings;
        },
        game_score: async (root: any, args: any) =>
          await GamePlayerScore.findAll({
            where: { gameId: args.id }
          }),
        games_list: async () => await Game.findAll(),
        game_players_list: async () => {
          // For now we'll return the active cache
          const items = await players.getGamePlayers();
	  return {
            id: 88888887,
            items
	  };
        },
        active_players_list: async () => {
          const items = await players.getGamePlayers();
	  return {
            id: 88888888,
            items
	  };
        },
        active_games_list: async () => {
          const items = await Game.findAll({
            where: {
              status: {
                [Op.ne]: "COMPLETE"
              }
            }
          });

          return {
            id: 99999999,
            items
          };
	},
        game: async (root: any, args: any) => await Game.findByPk(args.id),
        report_check_list: async () => this.getReportItemList(),
      },

      Mutation: {
        file_basic_tag_report: this.fileBasicTagReportMutation,
        file_team_tag_report: this.fileTeamTagReport,
        create_game: this.createGameMutation,
        update_game_settings: this.updateGameSettingsMutation,
        start_game: this.startGameMutation,
        end_game: this.endGameMutation,
        cancel_game: this.cancelGameMutation,
        start_registration: this.startRegistrationMutation,
        joined_player: this.joinedPlayerMutation
      },

      Subscription: {
        game_score: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator(GAME_SCORE_UPDATED),
            (payload, variables) => {
              return payload.game_id === variables.id;
            }
          )
        },
        report_check_list: {
          subscribe: () => this.pubsub.asyncIterator([REPORT_CHECKLIST_UPDATED])
        },
        game_settings: {
          subscribe: () => this.pubsub.asyncIterator([SETTINGS_UPDATED])
        },
        games_list: {
          subscribe: () => this.pubsub.asyncIterator([GAMES_UPDATED])
        },
        active_games_list: {
          subscribe: () => this.pubsub.asyncIterator([GAMES_UPDATED])
        },
        active_players_list: {
          subscribe: () => this.pubsub.asyncIterator([PLAYERS_UPDATED])
        }
      }
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    return schema;
  };
}

const gameManager = new GameManager();
export default gameManager;

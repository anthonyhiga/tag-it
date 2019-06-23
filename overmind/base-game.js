/******************************************************
 *
 *  This is a Base Implementation of a Custom Game
 *
 ******************************************************/
const StateMachine = require('javascript-state-machine');
const arbiters = require('./arbiters.js');
const games = require('./games.js');

const DEFAULT_GAME_SETTINGS = {
  reportDelaySec: 1,
  countDownSec: 6,
  gameLengthInMin: 1, // five minute game
  health: 5,   // 20 tags
  reloads: 100, // infinite
  shields: 30,  // 30 seconds of shields
  megatags: 0,  // No megatags
  totalTeams: 2,// Only 2 teams
  options: [],
}

function genId() {
  min = Math.ceil(0);
  max = Math.floor(2147483646);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class BaseState {
  setStateMachine(machine) {
    this.fsm = machine;
  }

  onGameSettingsUpdate(id, settings) { console.warn('UNABLE TO CHANGE GAME SETTINGS'); }
  onGameCreated(game) { console.warn('UNABLE TO CREATE NEW GAME'); }
  onGameStart(id) { console.warn('UNABLE TO START GAME'); }
  onChannelUpdated(channel) { console.warn('UNABLE TO PROCESS CHANNEL UPDATE'); }
  onRegistrationStart(id) { console.warn('UNABLE TO START REGISTRATION'); }
  onPlayerJoined(id, totemId) { console.warn('UNABLE ADD PLAYER TO GAME'); }
  onScoringStarted() { console.warn('UNABLE SCORE GAME'); }
}

class IdleState extends BaseState {
  onGameCreated(game) {
    this.fsm.game = game;
    this.fsm.setup();
  }
}

class SetupState extends BaseState {
  onRegistrationStart(id) {
    this.fsm.register();
  }
  onGameSettingsUpdate(id, settings) {
    console.log("UPDATED SETTINGS: ");
    console.log(settings);
    this.fsm.settings = {
      ...this.fsm.settings,
      ...settings
    };
  }
}

class RegistrationState extends BaseState {
  onPlayerJoined(id, totemId) {
    const player = this.fsm.players[id];
    if (player) {
      player.totemId = totemId;
      player.status = 'ACTIVE';
      console.log("PLAYER JOINED " + id + " TOTEM: " + totemId);
    } else {
      console.warn('PLAYER NOT REGISTERED, UNABLE TO JOIN PLAYER');
    }
  }

  onGameStart(id) {
    console.warn('STARTING GAME');
    const teams = this.fsm.teams;

    const gameLength = this.fsm.settings.gameLengthInMin * 60
      + this.fsm.settings.countDownSec
      + this.fsm.settings.reportDelaySec;

    this.fsm.gameTimer = setTimeout(() => {
      // Game Over
      this.fsm.score();
    }, gameLength * 1000);

    this.fsm.start()

    arbiters.broadcastArbiterCommand({
      type: 'START_GAME',
      gameId: this.fsm.game.ltId,
      team1Count: teams[1].count,
      team2Count: teams[2].count,
      team3Count: teams[3].count,
      countDownSec: this.fsm.settings.countDownSec,
    });
    console.warn('STARTING GAME DONE');
  }

  createPlayer() {
    const player = {
      id: genId(),
      status: 'IDLE',
    }

    console.log("ADDING NEW PLAYER: " + player.id);
    this.fsm.players[player.id] = player;
    return player;
  }

  getPlayerByTotemId(totemId) {
    for (const id in this.fsm.players) {
      const player = this.fsm.players[id];
      if (player.totemId == totemId) {
        console.log("FOUND PLAYER: " + id + " TOTEM: " + totemId);
        return player;
      }
    }
    return null;
  }

  updateTeamAssignment(player, teamCount) {
    const teams = this.fsm.teams;

    let teamId = 1;
    let team = teams[teamId];
    for (var i = 2; i <= teamCount; i++) {
      if (teams[i].count < team.count) {
        team = teams[i];
        teamId = i;
      }
    }

    const players = team.players;

    player.playerId = players.length;
    player.teamId = teamId;

    players.push(player);
    team.count++;

    console.log("ASSIGNING TO: " + player.teamId + " TEAM PLAYER ID: " + player.playerId);
  }

  // now we need to calculate
  onChannelUpdated(channel) {
    if (channel.status !== 'PRESENT') {
      return;
    }

    console.log('ARBITER ID: ' + channel.arbiterId + ' CHANNEL ACTIVE: ' + channel.name);

    const player = this.getPlayerByTotemId(channel.totemId) || this.createPlayer();
    if (player.status !== 'IDLE') {
      console.log('CHANNEL PLAYER FOR TOTEM: ' + channel.totemId + " IS ALREADY " + player.status);
      // TODO: setup some kind of timeout in case we need one
      return;
    }

    player.status = 'ADDING';
    player.totemId = channel.totemId;
    this.updateTeamAssignment(player, 2);

    arbiters.sendArbiterCommand(channel.arbiterId, {
      channel: channel.name,
      type: 'ADD_PLAYER',
      id: player.id,
      gameType: 'CUSTOM',
      gameId: this.fsm.game.ltId,
      teamId: player.teamId,
      playerId: player.playerId,
      ...this.fsm.settings,
    });
  }
}

class RunningState extends BaseState {
}

class ScoringState extends BaseState {
  onScoringStarted() {
    const teams = this.fsm.teams;
    console.log("SCORING GAME NOW");
    const players = Object.entries(this.fsm.players).map((player) => ({
      ltGameId: this.fsm.game.ltId,
      ltTeamId: player[1].teamId,
      ltPlayerId: player[1].playerId,
    }))

    games.scoreGame(players);
  }
}

function buildStateMachine() {
  const fsm = new StateMachine({
    init: 'idle',
    transitions: [
      { name: 'setup', from: 'idle', to: 'setup' },
      { name: 'register', from: 'setup', to: 'registration' },
      { name: 'start', from: 'registration', to: 'running' },
      { name: 'score', from: 'running', to: 'scoring' },
      { name: 'complete', from: 'scoring', to: 'complete' }, 
      { name: 'destroy', from: 'complete', to: 'destroy' },
    ],
    data: {
      id: genId(),
      gameTimer: null,
      settings: {
        ...DEFAULT_GAME_SETTINGS
      },
      players: {
      },
      teams: [
        {
          count: 0,
          players: [],
        },
        {
          count: 0,
          players: [],
        },
        {
          count: 0,
          players: [],
        },
        {
          count: 0,
          players: [],
        },
      ],
      states: {
        'idle': new IdleState(),
        'setup': new SetupState(),
        'registration': new RegistrationState(),
        'running': new RunningState(),
        'scoring': new ScoringState(),
        'complete': new BaseState(),
      }
    },
    methods: {
      getState: function() {
        const state = this.states[this.state];
        state.setStateMachine(this);
        return state;
      },
      onSetup: function(args) {
        console.warn('SETTING UP GAME');
      },
      onInit: function() {
        console.warn('BOOTING UP GAME ENGINE');
        arbiters.addHandler(this.id, 'onChannelUpdated', (channel) => {
          this.getState().onChannelUpdated(channel);
        })

        games.addHandler(this.id, 'onGameCreated', (game) => {
          this.getState().onGameCreated(game);
        })

        games.addHandler(this.id, 'onGameSettingsUpdate', (id, settings) => {
          this.getState().onGameSettingsUpdate(id, settings);
        })

        games.addHandler(this.id, 'onGameStart', (id) => {
          this.getState().onGameStart(id);
        })

        games.addHandler(this.id, 'onRegistrationStart', (id) => {
          this.getState().onRegistrationStart(id);
        })

        games.addHandler(this.id, 'onPlayerJoined', (id, totemId) => {
          this.getState().onPlayerJoined(id, totemId);
        })
      },
      onScore: function() {
        console.warn('SCORING GAME');
        this.getState().onScoringStarted();
      },
      onRegister: function() {
        console.warn('REGISTERING PLAYERS');
      },
      onDestroy: function() {
        console.warn("GAME COMPLETE, RELEASING RESOURCES");
        clearTimeout(this.gameTimer);
        arbiters.removeHandlers(this.id);
        games.removeHandlers(this.id);
      }
    }
  });

  return fsm;
}

module.exports = buildStateMachine;

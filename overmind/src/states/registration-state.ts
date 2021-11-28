import { BaseState } from "./base-state";
import {
  Game,
  GameSettings,
  GameTeam,
  Player,
  Channel,
  DEFAULT_SM_MODEL
} from "../base-types";
import arbiters from "../arbiters";
import manager from "../game-manager";
import users from "../users";
import players from "../players";

export class RegistrationState extends BaseState<{
  game: Game;
  settings: GameSettings;
  teams: GameTeam[];
  onStartGame: () => void;
}> {
  updateTimer: any;

  onEnter() {
    manager.updateGameState(this.props.game.id, "REGISTRATION");

    // Go through each channel and assign players
    arbiters.getChannelList().forEach(channel => {
      try {
        this.checkPolicyAndAssignPlayer(channel);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  onPlayerJoined = (id: number, totemId: number) => {
    const player = players.updateStatus(id, "ACTIVE");
    if (player) {
      console.log("PLAYER JOINED " + id + " TOTEM: " + totemId);
    } else {
      console.warn("PLAYER NOT REGISTERED, UNABLE TO JOIN PLAYER");
    }
  };

  onGameStart = () => {
    if (!players.hasActivePlayers()) {
      console.log("THERE ARE NO PLAYERS, NOT STARTING");
      return;
    }

    this.props.onStartGame();
  };

  onCancel = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  findTeam(teams: GameTeam[], teamCount: number) {
    // use balance system.  Find team w/ least players and assign to that one
    let team = teams[1];
    for (var i = 2; i <= teamCount; i++) {
      if (teams[i].count < team.count) {
        team = teams[i];
      }
    }
    return team;
  }

  updatePlayer(player: Player, team: GameTeam, settings: GameSettings) {
    // NO-OP
  }

  updateTeamAssignment(channel: Channel, player: Player, teamCount: number) {
    // If a player already has a team assigned, we use that
    const teams = this.props.teams;
    const channelSettings =
      this.props.settings.assignment &&
      this.props.settings.assignment.channel[channel.id || ""];
    let team = null;
    if (player.ltTeamId != null) {
      team = teams[player.ltTeamId];
    } else if (channelSettings && channelSettings.teamId != null) {
      team = teams[channelSettings.teamId];
    } else {
      team = this.findTeam(teams, teamCount);
    }

    if (team == null) {
      console.warn("UNABLE TO FIND TEAM FOR PLAYER: " + player.id);
      return false;
    }

    const players = team.players;
    if (players.length > 7) {
      // We can't have more than 8 players per team
      console.warn("TOO MANY PLAYERS ON TEAM: " + team.id);
      return false;
    }

    player.ltGameId = this.props.game.ltId;
    player.ltPlayerId = players.length;
    player.ltTeamId = team.id;

    // Give any children a chance to intercept and modify the player
    this.updatePlayer(player, team, this.props.settings);

    players.push(player);
    team.count++;
    return true;
  }

  checkPolicyAndAssignPlayer(channel: Channel) {
    // We'll only react and assign if the channel isn't currently
    if (
      this.props.settings.assignment &&
      this.props.settings.assignment.requestToAssign
    ) {
      // we only want to assign a player if it is requesting
      if (channel.status === "REQUESTING") {
        console.warn("ASSIGN CHANNEL: " + channel.arbiterId);
        this.assignPlayerToChannel(channel);
      } else {
        console.warn(
          "REQUEST - SKIPPING CHANNEL: " +
            channel.arbiterId +
            " STATUS: " +
            channel.status
        );
      }
    } else {
      if (channel.status === "AVAILABLE" || channel.status === "REQUESTING") {
        console.warn("ASSIGN CHANNEL: " + channel.arbiterId);
        this.assignPlayerToChannel(channel);
      } else {
        console.warn(
          "AVAILABLE - SKIPPING CHANNEL: " +
            channel.arbiterId +
            " STATUS: " +
            channel.status
        );
      }
    }
  }

  assignPlayerToChannel(channel: Channel) {
    console.log(
      "ARBITER ID: " + channel.arbiterId + " CHANNEL ACTIVE: " + channel.name
    );

    if (
      this.props.settings.assignment &&
      this.props.settings.assignment.requireTotem
    ) {
      if (channel.totemId == null) {
        console.log("CHANNEL HAS NO TOTEM, IGNORING");
        return;
      }
    }

    if (
      this.props.settings.assignment &&
      this.props.settings.assignment.requireHolsterOnly
    ) {
      if (channel.type !== "HOLSTER") {
        console.log("CHANNEL IS NOT A HOLSTER, IGNORING");
        return;
      }
    }

    let user = users.getUserByTotemId(channel.totemId);
    if (
      this.props.settings.assignment &&
      this.props.settings.assignment.registeredTotemsOnly
    ) {
      if (user == null) {
        console.log("UNABLE TO FIND PLAYER WITH TOTEM ID: " + channel.totemId);
        return;
      }
    }

    if (user == null) {
      // if we don't require a token id, we'll generate the user on demand
      user = users.createUser(channel.totemId);
    }

    const player = players.getOrCreatePlayer(this.props.game.id, user.id);

    if (player.status !== "IDLE") {
      console.log(
        "CHANNEL PLAYER FOR TOTEM: " +
          user.totemId +
          " IS ALREADY " +
          player.status
      );
      // TODO: setup some kind of timeout in case we need one
      return;
    }

    if (
      !this.updateTeamAssignment(
        channel,
        player,
        this.props.settings.totalTeams
      )
    ) {
      console.warn("FAILED TO ASSIGN PLAYER");
      return;
    }

    players.updateStatus(player.id, "JOINING");
    console.log(
      "ASSIGNING TO: " +
        player.ltTeamId +
        " TEAM PLAYER ID: " +
        player.ltPlayerId +
        " CHANNEL: " +
        channel.name
    );

    const mergedSettings = {...this.props.settings};
    // Override with player specific stuff
    if (player.health != null) {
      mergedSettings['health'] = player.health;
    }
    if (player.reloads != null) {
      mergedSettings['reloads'] = player.reloads;
    }
    if (player.shields != null) {
      mergedSettings['shields'] = player.shields;
    }
    if (player.megatags != null) {
      mergedSettings['megatags'] = player.megatags;
    }

    arbiters.sendArbiterCommand(channel.arbiterId, {
      channel: channel.name,
      type: "ADD_PLAYER",
      gameId: this.props.game.ltId,
      teamId: player.ltTeamId,
      playerId: player.ltPlayerId,
      ...mergedSettings,
      id: player.id,
    });
  }

  // now we need to calculate
  onChannelUpdated = (channel: Channel) => {
    this.checkPolicyAndAssignPlayer(channel);
  };

  model() {
    return {
      ...DEFAULT_SM_MODEL,
      onCancel: this.onCancel,
      onChannelUpdated: this.onChannelUpdated,
      onPlayerJoined: this.onPlayerJoined,
      onGameStart: this.onGameStart,
    };
  }
}

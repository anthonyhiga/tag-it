import { GamePlayer, Player } from "./base-types";
import users from "./users";

class Players {
  data: { [key: number]: Player } = {};
  handlers: {
    [key: string]: () => void;
  } = {};

  genId() {
    const min = Math.ceil(0);
    const max = Math.floor(2147483646);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  get(id: number): Player {
    return this.data[id];
  }

  setHandler(name: string, handler: () => void) {
    this.handlers[name] = handler;
  }

  runHandlers() {
    Object.values(this.handlers).forEach(value => {
      value();
    });
  }

  clear() {
    this.data = {};
    this.runHandlers();
  }

  hasActivePlayers() {
    return (
      Object.values(this.data).find(player => player.status === "ACTIVE") !=
      null
    );
  }

  getActiveGamePlayers(): GamePlayer[] {
    const activePlayers: GamePlayer[] = [];
    Object.values(this.data).forEach(player => {
      if (player.status === "ACTIVE") {
        const user = users.get(player.userId);
        if (user == null) {
          return;
        }
        activePlayers.push({
          ...user,
          ...player
        });
      }
    });
    return activePlayers;
  }

  getGamePlayers(): GamePlayer[] {
    const players: GamePlayer[] = [];
    Object.values(this.data).forEach(player => {
      const user = users.get(player.userId);
      if (user == null) {
        return;
      }
      players.push({
        ...user,
        ...player
      });
    });
    players.sort((a, b) => a.id - b.id);
    return players;
  }

  getActivePlayers(): Player[] {
    const activePlayers: Player[] = [];
    Object.values(this.data).forEach(player => {
      if (player.status === "ACTIVE") {
        activePlayers.push(player);
      }
    });
    return activePlayers;
  }

  getOrCreatePlayer(gameId: number, userId: number): Player {
    const result =
      this.getPlayer(gameId, userId) || this.createPlayer(gameId, userId);
    return result;
  }

  getPlayer(gameId: number, userId: number): Player | null {
    return (
      Object.values(this.data).find(
        player => player.userId == userId && player.gameId == gameId
      ) || null
    );
  }

  createPlayer(gameId: number, userId: number): Player {
    const player = {
      id: this.genId(),
      userId,
      gameId,
      ltTeamId: null,
      ltPlayerId: null,
      status: "IDLE"
    };
    this.data[player.id] = player;
    console.log("ADDING NEW PLAYER: " + player.id);
    this.runHandlers();
    return player;
  }

  updateStatus(id: number, status: string) {
    const player = this.get(id);
    if (player != null) {
      player.status = status;
    }
    console.warn("UPDATING PLAYER: " + id + " STATUS: " + status);
    this.runHandlers();
    return player;
  }
}

const players = new Players();

export default players;

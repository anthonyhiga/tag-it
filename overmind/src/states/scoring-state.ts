import { BaseState } from "./base-state";
import { Game, GameSettings, GameTeam, DEFAULT_SM_MODEL } from "../base-types";
import manager from "../game-manager";
import players from "../players";

export class ScoringState extends BaseState<{
  game: Game;
  settings: GameSettings;
  teams: GameTeam[];
  onComplete: () => void;
}> {
  onEnter() {
    manager.updateGameState(this.props.game.id, "SCORING");

    const activePlayers = players.getActivePlayers();
    const playerMap = Object.entries(activePlayers)
      .filter(player => player[1].status === "ACTIVE")
      .map(player => ({
        gameId: this.props.game.id,
        ltGameId: this.props.game.ltId,
        ltTeamId: player[1].ltTeamId,
        ltPlayerId: player[1].ltPlayerId
      }));

    manager.scoreGame(playerMap, this.props.settings.reportTimeLimitSec * 1000);
  }

  onFinalScore = () => {
    this.props.onComplete();
  };

  onGameEnd = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  model() {
    return {
      ...DEFAULT_SM_MODEL,
      onGameEnd: this.onGameEnd,
      onFinalScore: this.onFinalScore
    };
  }
}

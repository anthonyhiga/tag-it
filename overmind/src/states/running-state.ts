import { BaseState } from "./base-state";
import { Game, GameSettings, GameTeam, DEFAULT_SM_MODEL } from "../base-types";
import arbiters from "../arbiters";
import manager from "../game-manager";

export class RunningState extends BaseState<{
  game: Game;
  settings: GameSettings;
  teams: GameTeam[];
  onScoreGame: () => void;
}> {
  gameTimer: any = null;

  onEnter() {
    manager.updateGameState(this.props.game.id, "RUNNING");

    console.warn("GAME RUNNING");
    arbiters.broadcastArbiterCommand({
      type: "STOP_ADD_PLAYER"
    });

    const teams = this.props.teams;

    const gameLength =
      this.props.settings.gameLengthInMin * 60 +
      this.props.settings.countDownSec +
      this.props.settings.reportDelaySec;

    this.gameTimer = setTimeout(() => {
      // Game Over
      console.warn("GAME OVER");
      this.props.onScoreGame();
    }, gameLength * 1000);

    arbiters.broadcastArbiterCommand({
      type: "START_GAME",
      gameId: this.props.game.ltId,
      team1Count: teams[1].count,
      team2Count: teams[2].count,
      team3Count: teams[3].count,
      countDownSec: this.props.settings.countDownSec
    });
  }

  onLeave() {
    arbiters.broadcastArbiterCommand({
      type: "RESET"
    });
  }

  onGameEnd = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  model() {
    return {
      ...DEFAULT_SM_MODEL,
      onGameEnd: this.onGameEnd
    };
  }
}

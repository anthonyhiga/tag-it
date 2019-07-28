import { BaseState } from "./base-state";
import { Game, DEFAULT_SM_MODEL } from "../base-types";
import manager from "../game-manager";

export class CompleteState extends BaseState<{
  game: Game;
}> {
  onEnter() {
    manager.updateGameState(this.props.game.id, "AWARDS");
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

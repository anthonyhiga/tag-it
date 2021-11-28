import { BaseState } from "./base-state";
import { Game, DEFAULT_SM_MODEL } from "../base-types";
import manager from "../game-manager";

export class CompleteState extends BaseState<{
  game: Game;
}> {
  onEnter() {
    manager.updateGameState(this.props.game.id, "AWARDS");
  }

  onCancel = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  onGameEnd = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  model() {
    return {
      ...DEFAULT_SM_MODEL,
      onCancel: this.onCancel,
      onGameEnd: this.onGameEnd,
    };
  }
}

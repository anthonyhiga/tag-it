import StateMachine from "../state-machine";
import {
  SMModel,
  SMProps,
  GameMachineBuilder,
  GameSettings,
  Game,
  DEFAULT_GAME_SETTINGS
} from "../base-types";

import createGame from "./base-team-game";

const builder: GameMachineBuilder<StateMachine<SMProps, SMModel>> = {
  type: "solo-game",
  description: "Every Player for themselves.",
  name: "Solo Game",
  iconUrl: "blank",
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => {
    return createGame(
      {
        ...DEFAULT_GAME_SETTINGS,
        totalTeams: 1,
        gameType: "CUSTOM"
      },
      game,
      onGameSettingsUpdate
    );
  }
};
export default builder;

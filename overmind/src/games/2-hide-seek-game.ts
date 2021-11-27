import StateMachine from "../state-machine";
import {
  SMModel,
  SMProps,
  GameMachineBuilder,
  GameSettings,
  Game,
  DEFAULT_GAME_SETTINGS
} from "../base-types";

import createGame from "./base-hide-seek-game";
import icon from "./2-hide-seek-game-icon";

const builder: GameMachineBuilder<StateMachine<SMProps, SMModel>> = {
  type: "hide-seek-game",
  description:
    "2 Teams alternate between hiding and seeking every 1 minute. Starting team randomly chosen.",
  name: "Hide And Seek",
  iconUrl: icon,
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => {
    return createGame(
      {
        ...DEFAULT_GAME_SETTINGS,
        gameType: "HIDE-AND-SEEK",
        gameLengthInMin: 4,
        totalTeams: 2,
        options: [
          Math.random() < 0.5 ? "team_1_hunts_first" : "team_2_hunts_first"
        ]
      },
      game,
      onGameSettingsUpdate
    );
  }
};
export default builder;

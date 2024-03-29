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
import icon from "./3-hide-seek-game-icon";

const builder: GameMachineBuilder<StateMachine<SMProps, SMModel>> = {
  type: "hunter-hunted-game",
  description:
    "3 Teams Alternate Between Hunting and being Hunted by Each other, every 1 minute.",
  name: "Hunter and Hunted",
  iconUrl: icon,
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => {
    return createGame(
      {
        ...DEFAULT_GAME_SETTINGS,
        gameType: "HUNTER-HUNTED",
        gameLengthInMin: 6,
        totalTeams: 3,
        options: ["team_1_hunts_first"]
      },
      game,
      onGameSettingsUpdate
    );
  }
};
export default builder;

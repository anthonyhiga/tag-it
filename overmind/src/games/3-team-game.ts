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
  type: "3-team-game",
  description:
    "Players are separated into 3 teams.  Team members cannot shoot each other.",
  name: "3 Team Game",
  iconUrl: "blank",
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => {
    return createGame(
      {
        ...DEFAULT_GAME_SETTINGS,
        totalTeams: 3, // Default to 2 Teams
        gameType: "3-TEAMS"
      },
      game,
      onGameSettingsUpdate
    );
  }
};
export default builder;

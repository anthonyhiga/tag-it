import StateMachine from "../state-machine";
import {
  SMModel,
  SMProps,
  GameMachineBuilder,
  GameSettings,
  Game,
  DEFAULT_GAME_SETTINGS
} from "../base-types";
import { SetupState } from "../states/setup-state";
import { RegistrationState } from "../states/registration-state";
import { RunningState } from "../states/running-state";
import { ScoringState } from "../states/scoring-state";

const createMachine = (
  game: Game,
  onGameSettingsUpdate: (settings: GameSettings) => void
) => {
  const sm = new StateMachine<SMProps, SMModel>({
    settings: {
      ...DEFAULT_GAME_SETTINGS,
      totalTeams: 2 // Default to 2 Teams
    },
    onGameSettingsUpdate
  });
  sm.configure((machine: StateMachine<SMProps, SMModel>) => ({
    initial: "setup",
    states: {
      setup: new SetupState(() => ({
        onRegister: machine.goto("registration"),
        game: game,
        initialSettings: machine.props.settings,
        settings: machine.variable("settings"),
        setSettings: machine.setVariable("settings"),
        onGameSettingsUpdate: machine.props.onGameSettingsUpdate,
        teams: machine.variable("teams"),
        setTeams: machine.setVariable("teams")
      })),
      registration: new RegistrationState(() => ({
        onStartGame: machine.goto("running"),
        game: game,
        settings: machine.variable("settings"),
        teams: machine.variable("teams")
      })),
      running: new RunningState(() => ({
        onScoreGame: machine.goto("scoring"),
        game: game,
        settings: machine.variable("settings"),
        teams: machine.variable("teams")
      })),
      scoring: new ScoringState(() => ({
        game: game,
        settings: machine.variable("settings"),
        teams: machine.variable("teams")
      }))
    }
  }));
  return sm;
};

const builder: GameMachineBuilder<StateMachine<SMProps, SMModel>> = {
  type: "2-team-game",
  description: "Play a game with 2 teams.",
  name: "2 Team Game",
  iconUrl: "https://images.unsplash.com/photo-1545114010-4e20f94c7349",
  build: createMachine
};
export default builder;

import StateMachine from "../state-machine";
import {
  SMModel,
  SMProps,
  GameMachineBuilder,
  GameSettings,
  Game,
  DEFAULT_GAME_SETTINGS
} from "../base-types";

import icon from "./overpowered-game-icon";

import { SetupState } from "../states/setup-state";
import { OverpoweredRegistrationState } from "./states/overpowered-registration-state";
import { RunningState } from "../states/running-state";
import { ScoringState } from "../states/scoring-state";
import { CompleteState } from "../states/complete-state";

const createGame = (
  settings: GameSettings,
  game: Game,
  onGameSettingsUpdate: (settings: GameSettings) => void
) => {
  const sm = new StateMachine<SMProps, SMModel>({
    settings,
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
      registration: new OverpoweredRegistrationState(() => ({
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
        teams: machine.variable("teams"),
        onComplete: machine.goto("complete")
      })),
      complete: new CompleteState(() => ({
        game: game
      }))
    }
  }));
  return sm;
};

const builder: GameMachineBuilder<StateMachine<SMProps, SMModel>> = {
  type: "overpowered-game",
  description:
    "One overpowered player vs. everyone.  Team members cannot shoot each other.",
  name: "Overpowered",
  iconUrl: icon,
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => {
    return createGame(
      {
        ...DEFAULT_GAME_SETTINGS,
        totalTeams: 2, // Default to 2 Teams
        gameType: "2-TEAMS",
        health: 10,
        reloads: 99,
        shields: 99,
      },
      game,
      onGameSettingsUpdate
    );
  }
};
export default builder;

import StateMachine from "../state-machine";
import { SMModel, SMProps, GameSettings, Game } from "../base-types";
import { SetupState } from "../states/setup-state";
import { RegistrationState } from "../states/registration-state";
import { RunningState } from "../states/running-state";
import { ScoringState } from "../states/scoring-state";
import { CompleteState } from "../states/complete-state";

const normalizeGameLength = (settings: GameSettings) => {
  const gameLengthInMin = Math.floor(
    settings.gameLengthInMin / settings.totalTeams
  );
  return {
    ...settings,
    gameLengthInMin:
      gameLengthInMin < settings.totalTeams
        ? settings.totalTeams
        : gameLengthInMin
  };
};

const createMachine = (
  settings: GameSettings,
  game: Game,
  onGameSettingsUpdate: (settings: GameSettings) => void
) => {
  const sm = new StateMachine<SMProps, SMModel>({
    settings: normalizeGameLength({
      ...settings
    }),
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
        onGameSettingsUpdate: (settings: GameSettings) => {
          machine.props.onGameSettingsUpdate(normalizeGameLength(settings));
        },
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

export default createMachine;

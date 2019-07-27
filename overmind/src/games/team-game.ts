import StateMachine from "../state-machine";
import { SMModel, SMProps, GameMachineBuilder, Game } from "../base-types";
import { SetupState } from "../states/setup-state";
import { RegistrationState } from "../states/registration-state";
import { RunningState } from "../states/running-state";
import { ScoringState } from "../states/scoring-state";

const createMachine = (game: Game) => {
  const sm = new StateMachine<SMProps, SMModel>({});
  sm.configure((machine: StateMachine<SMProps, SMModel>) => ({
    initial: "setup",
    states: {
      setup: new SetupState(() => ({
        onRegister: machine.goto("registration"),
        game: game,
        settings: machine.variable("settings"),
        setSettings: machine.setVariable("settings"),
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
  type: "base-game",
  description: "Play a game with 2 or 3 teams.",
  name: "Team Game",
  iconUrl: "https://atgbcentral.com/data/out/36/4204664-cool-image.jpg",
  build: createMachine
};
export default builder;

import { BaseState } from "./base-state";
import { Game, GameSettings, GameTeam, DEFAULT_SM_MODEL } from "../base-types";
import manager from "../game-manager";

const DEFAULT_TEAM = { count: 0, players: [] };

export class SetupState extends BaseState<{
  onRegister: () => void;
  game: Game;
  initialSettings: GameSettings;
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
  onGameSettingsUpdate: (settings: GameSettings) => void;
  teams: GameTeam[];
  setTeams: (teams: GameTeam[]) => void;
}> {
  buildTeam(id: number) {
    return { id, ...DEFAULT_TEAM };
  }

  updateSettings(settings: GameSettings) {
    this.props.setSettings(settings);
    this.props.onGameSettingsUpdate(settings);
  }

  onEnter() {
    this.props.setTeams([
      this.buildTeam(0),
      this.buildTeam(1),
      this.buildTeam(2),
      this.buildTeam(3)
    ]);
    this.updateSettings(this.props.initialSettings);
  }

  onGameEnd = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  onGameSettingsUpdate = (settings: GameSettings) => {
    console.warn("UPDATING SETTINGS");
    console.warn(settings);
    this.updateSettings({
      ...this.props.initialSettings,
      ...settings
    });
  };

  onRegistrationStart = () => {
    this.props.onRegister();
  };

  model() {
    return {
      ...DEFAULT_SM_MODEL,
      onGameEnd: this.onGameEnd,
      onGameSettingsUpdate: this.onGameSettingsUpdate,
      onRegistrationStart: this.onRegistrationStart
    };
  }
}

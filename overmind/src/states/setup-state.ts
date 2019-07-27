import { BaseState } from "./base-state";
import {
  Game,
  GameSettings,
  GameTeam,
  DEFAULT_SM_MODEL,
  DEFAULT_GAME_SETTINGS
} from "../base-types";
import manager from "../game-manager";

const DEFAULT_TEAM = { count: 0, players: [] };

export class SetupState extends BaseState<{
  onRegister: () => void;
  game: Game;
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
  teams: GameTeam[];
  setTeams: (teams: GameTeam[]) => void;
}> {
  buildTeam(id: number) {
    return { id, ...DEFAULT_TEAM };
  }

  onEnter() {
    this.props.setTeams([
      this.buildTeam(0),
      this.buildTeam(1),
      this.buildTeam(2),
      this.buildTeam(3)
    ]);
    this.props.setSettings({ ...DEFAULT_GAME_SETTINGS });
  }

  onGameEnd = () => {
    manager.updateGameState(this.props.game.id, "COMPLETE");
  };

  onGameSettingsUpdate = (settings: GameSettings) => {
    console.warn("UPDATING SETTINGS");
    this.props.setSettings({
      ...DEFAULT_GAME_SETTINGS,
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

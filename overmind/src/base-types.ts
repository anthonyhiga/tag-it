/**
 * Game Player
 */

export interface Channel {
  id?: string;
  arbiterId: string;
  name: string;
  type: string;
  status: string;
  totemId: number;
}

export interface Player {
  id: number;
  userId: number;
  gameId: number;
  ltTeamId: number | null;
  ltPlayerId: number | null;
  status: string;
}

export interface GamePlayer {
  id: number;
  gameId: number;
  ltTeamId: number | null;
  ltPlayerId: number | null;
  status: string;
  totemId: number;
  name: string;
  iconUrl: string;
  avatarUrl: string;
}

export interface User {
  id: number;
  totemId: number;
  name: string;
  iconUrl: string;
  avatarUrl: string;
}

export interface Game {
  id: number;
  ltId: number;
  status: string;
  startedAt: Date;
  completedAt: Date;
  save: () => void;
}

export interface GameSettings {
  assignment?: {
    requestToAssign: boolean;
    requireTotem: boolean;
    registeredTotemsOnly: boolean;
    channel: {
      [channelName: string]: { teamId: number };
    };
  };
  reportTimeLimitSec: number;
  reportDelaySec: number;
  countDownSec: number;
  gameLengthInMin: number; // five minute game
  health: number;
  reloads: number;
  shields: number;
  megatags: number;
  totalTeams: number;
  gameType: string;
  options?: string[];
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  assignment: {
    requestToAssign: false,
    requireTotem: false,
    registeredTotemsOnly: false,
    channel: {}
  },
  reportTimeLimitSec: 120,
  reportDelaySec: 1,
  countDownSec: 30,
  gameLengthInMin: 5, // five minute game
  health: 35,
  reloads: 99,
  shields: 99,
  megatags: 0,
  totalTeams: 1,
  gameType: "CUSTOM",
  options: []
};

export type GameState =
  | "COMPLETE"
  | "RUNNING"
  | "AWARDS"
  | "SCORING"
  | "REGISTRATION";

export interface GameTeam {
  id: number;
  count: number;
  players: Player[];
}

export interface SMProps {
  settings: GameSettings;
  onGameSettingsUpdate: (settings: GameSettings) => void;
}

export interface SMModel {
  onGameEnd: () => void;
  onGameSettingsUpdate: (settings: GameSettings) => void;
  onRegistrationStart: () => void;
  onChannelUpdated: (channel: Channel) => void;
  onPlayerJoined: (id: number, totemId: number) => void;
  onGameStart: () => void;
  onFinalScore: (score: any) => void;
}

const DEFAULT_HANDLER = (name: string) => () => {
  console.warn("NOT IMPLEMENTED HANDLER CALLED: " + name);
};

export const DEFAULT_SM_MODEL: SMModel = {
  onGameEnd: DEFAULT_HANDLER("onGameEnd"),
  onGameSettingsUpdate: DEFAULT_HANDLER("onGameSettingsUpdate"),
  onRegistrationStart: DEFAULT_HANDLER("onRegistrationStart"),
  onChannelUpdated: DEFAULT_HANDLER("onChannelUpdated"),
  onPlayerJoined: DEFAULT_HANDLER("onPlayerJoined"),
  onGameStart: DEFAULT_HANDLER("onGameStart"),
  onFinalScore: DEFAULT_HANDLER("onFinalScore")
};

export interface GameMachineBuilder<SM> {
  type: string;
  build: (
    game: Game,
    onGameSettingsUpdate: (settings: GameSettings) => void
  ) => SM;
  iconUrl: string;
  description: string;
  name: string;
}

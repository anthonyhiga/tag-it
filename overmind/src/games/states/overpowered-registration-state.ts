import { RegistrationState } from "../../states/registration-state";
import {
  GameTeam,
  GameSettings,
  Player,
} from "../../base-types";

export class OverpoweredRegistrationState extends RegistrationState
{
  updatePlayer(player: Player, team: GameTeam, settings: GameSettings) {
    // We make everyone on team 1, Overpowered
    if (team.id === 1) {
      player.health = 99;
      player.shields = 0;
      player.reloads = 99;
      player.megatags = 0;
    }
  }

  findTeam(teams: GameTeam[], teamCount: number) {
    // First time, we assign that person to be the overpowered player
    if (teams[1].count <= 0) {
      return teams[1];
    }

    // Otherwise, they belong to "Everyone"
    return teams[2];
  }
}

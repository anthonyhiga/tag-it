/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useMutation } from "react-relay";
import type {
  PlayerStatus,
  SpectatorScoreBoardQuery,
} from "./__generated__/SpectatorScoreBoardQuery.graphql";

type Props = {
  id: string;
};

type PlayerRecord = {
  readonly id: string;
  readonly status: PlayerStatus;
  readonly ltTeamId: string | null;
  readonly ltPlayerId: string | null;
  readonly name: string | null;
  readonly totemId: string;
  readonly avatarUrl: string;
  readonly iconUrl: string;
};

type ScoreRecord = {
  readonly id: string;
  readonly gameId: string;
  readonly teamId: string | null;
  readonly playerId: string | null;
  readonly totalTagsReceived: number;
  readonly totalTagsGiven: number;
  readonly survivedTimeSec: number;
  readonly zoneTimeSec: number;
  readonly ltGameId: string;
  readonly ltTeamId: string;
  readonly ltPlayerId: string;
};

const styles: any = {
  container: {
    fontSize: "50px",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: "300px",
    paddingTop: "10px",
    paddingBottom: "15px",
  },
  title: {
    display: "block",
    fontSize: "50px",
    padding: "10px",
    marginLeft: "100px",
    color: "white",
  },
  team: {
    textAlign: "center",
    display: "block",
    fontSize: "40px",
    color: "white",
  },
  text: {
    textAlign: "center",
    display: "block",
    fontSize: "30px",
    color: "white",
  },
  header: {
    paddingRight: "30px",
    paddingLeft: "30px",
  },
  icon: {
    width: "100px",
    height: "100px",
  },
  solo: {
    backgroundColor: "rgba(50, 50, 50, 0.2)",
    borderRadius: "20px",
    margin: "20px",
    padding: "20px",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px",
  },
};

const teamStyle: any = {
  1: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderRadius: "20px",
    margin: "20px",
    padding: "20px",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px",
  },
  2: {
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    borderRadius: "20px",
    margin: "20px",
    padding: "20px",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px",
  },
  3: {
    backgroundColor: "rgba(50, 50, 50, 0.2)",
    borderRadius: "20px",
    margin: "20px",
    padding: "20px",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px",
  },
};

export default function SpectatorScoreBoard({ id }: Props) {
  const { t } = useTranslation("referee");
  const [commit] = useMutation(
    graphql`
      mutation SpectatorScoreBoardButtonMutation($id: ID!) {
        end_game(id: $id) {
          id
        }
      }
    `,
  );
  const onClick = useCallback(() => {
    commit({ variables: { id } });
  }, [id]);

  const data = useLazyLoadQuery<SpectatorScoreBoardQuery>(
    graphql`
      query SpectatorScoreBoardQuery($id: ID!) {
        game_score(id: $id) {
          id
          gameId
          teamId
          playerId
          totalTagsReceived
          totalTagsGiven
          survivedTimeSec
          zoneTimeSec
          ltGameId
          ltTeamId
          ltPlayerId
        }
        game_players_list(id: $id) {
          id
          items {
            id
            status
            ltTeamId
            ltPlayerId
            name
            totemId
            avatarUrl
            iconUrl
          }
        }
        game_settings(id: $id) {
          countDownSec
          gameLengthInMin
          health
          reloads
          shields
          megatags
          totalTeams
        }
      }
    `,
    { id },
    { fetchPolicy: "store-and-network" },
  );

  const isAlive = useCallback(
    (timeLived: number): boolean => {
      return (data?.game_settings?.gameLengthInMin ?? 0) * 60 <= timeLived;
    },
    [data?.game_settings?.gameLengthInMin],
  );

  const playerMap = useMemo(() => {
    const result: {
      [id: string]: PlayerRecord;
    } = {};

    data?.game_players_list?.items?.forEach((item) => {
      if (item != null) {
        result[item.id] = item;
      }
    });
    return result;
  }, [data?.game_players_list?.items]);

  const {
    mvpWinningScore,
    gameScore,
    teamWinningScore,
    teamTotalWinners,
    teamSummary,
  } = useMemo(() => {
    const gameScore = [...(data.game_score ?? [])];
    gameScore.sort((a, b) => {
      if (a == null || b == null) {
        return 0;
      }
      return (
        b.totalTagsGiven - a.totalTagsGiven ||
        a.totalTagsReceived - b.totalTagsReceived
      );
    });

    let teamWinningScore: number = 0;
    let teamTotalWinners: number = 0;
    let mvpWinningScore: number = -10000;

    const teamSummary = [];
    for (let i = 0; i <= 3; i++) {
      let score = 0;
      let players = 0;
      gameScore.forEach((item) => {
        if (item?.ltTeamId != i.toString()) {
          return;
        }
        score += item.totalTagsGiven;
        const mvpScore = item.totalTagsGiven - item.totalTagsReceived;
        if (mvpScore > mvpWinningScore) {
          mvpWinningScore = mvpScore;
        }
        players++;
      });
      if (score > teamWinningScore) {
        teamWinningScore = score;
      }
      if (players > 0) {
        teamSummary.push({
          teamId: i,
          score,
          players,
        });
      }
    }

    teamSummary.forEach((team) => {
      if (team.score === teamWinningScore) {
        teamTotalWinners++;
      }
    });

    return {
      mvpWinningScore,
      teamSummary,
      gameScore,
      teamTotalWinners,
      teamWinningScore,
    };
  }, [data?.game_score]);

  return (
    <>
      <div style={styles.container}>
        <div
          style={styles.title}
          className="animate__animated animate__lightSpeedInRight animate_alternate"
        >
          {t("Score Board")}
        </div>
      </div>

      <br />
      <br />
      <table>
        <tr>
          {teamSummary.map((summary) => (
            <td>
              <div
                style={teamStyle[summary.teamId] || styles.solo}
                className="animate__animated animate__zoomInUp animate_alternate"
              >
                {teamSummary.length > 1 && (
                  <div style={styles.team}>
                    Team {summary.teamId} - Score: {summary.score}
                    {summary.score === teamWinningScore
                      ? teamTotalWinners > 1
                        ? " (Tie)"
                        : " (Winner)"
                      : null}
                  </div>
                )}
                <table style={styles.text}>
                  <tr>
                    <th></th>
                    <th style={styles.header}>Name</th>
                    <th style={styles.header}>Score</th>
                    <th style={styles.header}>Injured</th>
                    <th style={styles.header}>Life Span</th>
                  </tr>
                  {gameScore.map((item) => {
                    if (item?.playerId == null) {
                      return null;
                    }
                    const player = playerMap[item.playerId];
                    const isMVP =
                      item.totalTagsGiven - item.totalTagsReceived ===
                      mvpWinningScore;
                    return item.ltTeamId == summary.teamId.toString() ? (
                      <tr>
                        <td>
                          <img style={styles.icon} src={player?.avatarUrl} />
                        </td>
                        <td>
                          {player?.name}
                          {isMVP && " (MVP)"}
                        </td>
                        <td>{item.totalTagsGiven}</td>
                        <td>{item.totalTagsReceived}</td>
                        <td>
                          {isAlive(item.survivedTimeSec)
                            ? t("SURVIVED")
                            : Math.round(item.survivedTimeSec / 60) + " (m)"}
                        </td>
                      </tr>
                    ) : null;
                  })}
                </table>
              </div>
            </td>
          ))}
        </tr>
      </table>
    </>
  );
}

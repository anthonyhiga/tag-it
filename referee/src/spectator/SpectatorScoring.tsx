/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { graphql } from "babel-plugin-relay/macro";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import type {
  ReportStatusType,
  SpectatorScoringQuery,
} from "./__generated__/SpectatorScoringQuery.graphql";

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
  team1: {
    backgroundColor: "red",
  },
  team2: {
    backgroundColor: "blue",
  },
  team3: {
    backgroundColor: "grey",
  },
  solo: {
    backgroundColor: "grey",
  },
};

const styleMap: any = {
  ...[1, 2, 3, 4].reduce(
    (previousValue, index) => ({
      ...previousValue,
      [index]: {
        player: {
          display: "inline-block",
          backgroundColor: "rgba(0,0,0,0.85)",
          border: 0,
          width: "300px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          textAlign: "center",
          padding: "20px",
          margin: "10px",
        },
        playerIcon: {
          width: "300px",
          height: "300px",
          border: 0,
          borderRadius: "15px",
        },
        playerName: {
          display: "block",
          fontSize: "40px",
          color: "white",
        },
        playerStatus: {
          display: "block",
          fontSize: "30px",
          color: "white",
        },
      },
    }),
    {},
  ),
  ...[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].reduce(
    (previousValue, index) => ({
      ...previousValue,
      [index]: {
        player: {
          display: "inline-block",
          backgroundColor: "rgba(0,0,0,0.85)",
          border: 0,
          width: "150px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          textAlign: "center",
          padding: "20px",
          margin: "10px",
        },
        playerIcon: {
          width: "150px",
          height: "150px",
          border: 0,
          borderRadius: "15px",
        },
        playerName: {
          display: "block",
          fontSize: "20px",
          color: "white",
        },
        playerStatus: {
          display: "block",
          fontSize: "15px",
          color: "white",
        },
      },
    }),
    {},
  ),
  ...[17, 18, 19, 20, 21, 22, 23, 24].reduce(
    (previousValue, index) => ({
      ...previousValue,
      [index]: {
        player: {
          display: "inline-block",
          backgroundColor: "rgba(0,0,0,0.85)",
          border: 0,
          width: "125px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          textAlign: "center",
          padding: "18px",
          margin: "8px",
        },
        playerIcon: {
          width: "125px",
          height: "125px",
          border: 0,
          borderRadius: "15px",
        },
        playerName: {
          display: "block",
          fontSize: "15px",
          color: "white",
        },
        playerStatus: {
          display: "block",
          fontSize: "12px",
          color: "white",
        },
      },
    }),
    {},
  ),
};

type Props = { id: string };

export default function SpectatorScoring({ id }: Props) {
  const { t } = useTranslation("referee");
  const data = useLazyLoadQuery<SpectatorScoringQuery>(
    graphql`
      query SpectatorScoringQuery {
        report_check_list {
          id
          items {
            gameId
            ltTeamId
            ltPlayerId
            ltTagTeamId
            type
            status
            name
            avatarUrl
            iconUrl
          }
        }
        active_games_list {
          id
          items {
            id
            status
            startedAt
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription SpectatorScoringSubscription {
          report_check_list {
            id
            items {
              gameId
              ltTeamId
              ltPlayerId
              ltTagTeamId
              type
              status
              name
              avatarUrl
              iconUrl
            }
          }
        }
      `,
    }),
    [],
  );
  useSubscription(config);

  const items = data?.active_games_list?.items ?? [];
  const activeGame = items.length > 0 ? items[0] : null;

  const startTime = activeGame?.startedAt ?? "0";
  const startDate = new Date(parseInt(startTime, 10)).getTime();

  const reportCheckList: {
    [id: string]: {
      id: string;
      ltTeamId: string | number;
      recordedReports: number;
      totalReports: number;
      status: ReportStatusType;
      name: string | null;
      avatarUrl: string | null;
      iconUrl: string | null;
    };
  } = {};

  let teamCount = 0;
  data?.report_check_list?.items?.forEach((item) => {
    const id = item?.ltTeamId + ":" + item?.ltPlayerId;
    let listItem = reportCheckList[id];
    if (listItem == null && item != null) {
      const teamId = parseInt(item?.ltTeamId ?? "1");
      if (teamId > teamCount) {
        teamCount = teamId;
      }

      reportCheckList[id] = {
        ...item,
        id,
        totalReports: 0,
        recordedReports: 0,
        ltTeamId: teamId,
      };
      listItem = reportCheckList[id];
    }

    // Pending always trumps everything
    if (item?.status == "PENDING") {
      listItem.status = "PENDING";
    } else {
      listItem.recordedReports++;
    }

    listItem.totalReports++;
  });

  const reportList = Object.values(reportCheckList);

  let count = 0;
  let total = reportList.length;
  reportList.forEach((item) => {
    if (item?.status === "PENDING") {
      count++;
    }
  });

  const players = total - count;
  return (
    <>
      <div style={styles.container}>
        <div
          style={styles.title}
          className="animate__animated animate__lightSpeedInRight animate_alternate"
        >
          {t("Scoring Game - Point Gun at Sensor")}
        </div>
      </div>
      <br />
      <div style={styles.players}>
        {reportList.map((item: any) => {
          let iconStyle = {
            ...(styleMap[reportList.length]?.playerIcon ?? styles.playerIcon),
          };
          if (item?.ltTeamId == 1) {
            iconStyle = { ...iconStyle, ...styles.team1 };
          } else if (item?.ltTeamId == 2) {
            iconStyle = { ...iconStyle, ...styles.team2 };
          } else if (item?.ltTeamId == 3) {
            iconStyle = { ...iconStyle, ...styles.team3 };
          } else {
            iconStyle = { ...iconStyle, ...styles.solo };
          }
          return (
            <div
              style={styleMap[reportList.length]?.player ?? styles.player}
              className="animate__animated animate__zoomInUp animate_alternate"
            >
              <img style={iconStyle} src={item?.avatarUrl} />
              <div
                style={
                  styleMap[reportList.length]?.playerName ?? styles.playerName
                }
              >
                {item?.name}
              </div>
              <div
                style={
                  styleMap[reportList.length]?.playerStatus ??
                  styles.playerStatus
                }
                className={
                  item?.status === "COMPLETE"
                    ? "animate__animated animate__rotateIn"
                    : "animate__animated animate__jello animate__infinite"
                }
              >
                {item?.status === "COMPLETE" ? "SCORED" : "WAITING"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

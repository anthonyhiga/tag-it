import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import "animate.css";
import { useFragment, useLazyLoadQuery, useSubscription } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import type { SpectatorRegistrationPlayerListQuery } from "./__generated__/SpectatorRegistrationPlayerListQuery.graphql";

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
  players: {
    padding: "10px",
  },
  player: {
    display: "inline-block",
    border: 0,
    width: "150px",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: "15px",
    borderWidth: "2px",
    borderColor: "black",
    textAlign: "center",
    padding: "20px",
    margin: "10px",
    transition: "width .5s, height 0.5s",
  },
  team1: {
    backgroundColor: "rgba(252, 3, 140, 0.2)",
  },
  team2: {
    backgroundColor: "rgba(98, 3, 252, 0.2)",
  },
  team3: {
    backgroundColor: "rgba(252, 157, 3, 0.2)",
  },
  solo: {
    backgroundColor: "rgba(50, 50, 50, 0.2)",
  },
  playerIcon: {
    width: "150px",
    height: "150px",
    border: 0,
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
};

const styleMap: any = {
  ...[1, 2, 3, 4].reduce(
    (previousValue, index) => ({
      ...previousValue,
      [index]: {
        player: {
          display: "inline-block",
          width: "300px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          borderStyle: "solid",
          borderWidth: "2px",
          borderColor: "black",
          textAlign: "center",
          padding: "20px",
          margin: "10px",
          transition: "width .5s, height 0.5s",
        },
        playerIcon: {
          width: "300px",
          height: "300px",
          border: 0,
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
          width: "150px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          borderStyle: "solid",
          borderWidth: "2px",
          borderColor: "black",
          textAlign: "center",
          padding: "20px",
          margin: "10px",
          transition: "width .5s, height 0.5s",
        },
        playerIcon: {
          width: "150px",
          height: "150px",
          border: 0,
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
          width: "125px",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "15px",
          borderStyle: "solid",
          borderWidth: "2px",
          textAlign: "center",
          padding: "18px",
          margin: "8px",
          transition: "width .5s, height 0.5s",
        },
        playerIcon: {
          width: "125px",
          height: "125px",
          border: 0,
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

type Props = {};

export default function SpectatorRegistration({}: Props) {
  const { t } = useTranslation("spectator");

  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription SpectatorRegistrationSubscription {
          active_players_list {
            id
            items {
              status
              ltTeamId
              ltTeamId
              name
              iconUrl
              avatarUrl
            }
          }
        }
      `,
    }),
    [],
  );
  useSubscription(config);

  const playerData = useLazyLoadQuery<SpectatorRegistrationPlayerListQuery>(
    graphql`
      query SpectatorRegistrationPlayerListQuery {
        active_players_list {
          id
          items {
            id
            status
            ltTeamId
            ltTeamId
            name
            iconUrl
            avatarUrl
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const seen: any = useRef({});
  const activePlayers = useMemo(() => {
    playerData?.active_players_list?.items?.forEach((item) => {
      if (seen.current[item?.id ?? ""] != null) {
        return;
      }

      seen.current[item?.id ?? ""] = new Date().getTime();
    });

    const result = [...(playerData?.active_players_list?.items ?? [])];
    result.sort(
      (a, b) => seen.current[a?.id ?? ""] - seen.current[b?.id ?? ""],
    );
    return result;
  }, [playerData?.active_players_list?.items]);
  return (
    <>
      <div style={styles.container}>
        <div
          style={styles.title}
          className="animate__animated animate__lightSpeedInRight animate_alternate"
        >
          {" "}
          {t("Registering Players - Join Game Now")}
        </div>
      </div>
      <audio autoPlay>
        <source src="music/laserrocket2-6284.mp3" type="audio/mpeg" />
      </audio>
      <br />
      <div style={styles.players}>
        {activePlayers.map((item: any, i) => {
          let playerStyle =
            styleMap[activePlayers.length]?.player ?? styles.player;
          if (item?.ltTeamId === "1") {
            playerStyle = { ...playerStyle, ...styles.team1 };
          } else if (item?.ltTeamId === "2") {
            playerStyle = { ...playerStyle, ...styles.team2 };
          } else if (item?.ltTeamId === "3") {
            playerStyle = { ...playerStyle, ...styles.team3 };
          } else {
            playerStyle = { ...playerStyle, ...styles.solo };
          }
          return (
            <div
              key={item?.id}
              style={playerStyle}
              className="animate__animated animate__zoomInUp animate_alternate"
            >
              <img
                style={
                  styleMap[activePlayers.length]?.playerIcon ??
                  styles.playerIcon
                }
                src={item?.avatarUrl}
              />
              <div
                style={
                  styleMap[activePlayers.length]?.playerName ??
                  styles.playerName
                }
              >
                {item?.name}
              </div>
              <div
                style={
                  styleMap[activePlayers.length]?.playerStatus ??
                  styles.playerStatus
                }
                className={
                  item?.status === "ACTIVE"
                    ? "animate__animated animate__rotateIn"
                    : "animate__animated animate__jello animate__infinite"
                }
              >
                {item?.status === "ACTIVE" ? "READY" : "JOINING"}
                {item?.status === "ACTIVE" ? (
                  <audio autoPlay key={"ACTIVE" + item?.id}>
                    <source src="music/game-start-6104.mp3" type="audio/mpeg" />
                  </audio>
                ) : (
                  <audio autoPlay key={"JOINING" + item?.id}>
                    <source
                      src="music/dramatic-camera-zoom-6393.mp3"
                      type="audio/mpeg"
                    />
                  </audio>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

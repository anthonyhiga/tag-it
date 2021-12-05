/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */

import "animate.css";
import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import SpectatorIdle from "./SpectatorIdle";
import SpectatorRegistration from "./SpectatorRegistration";
import SpectatorSetup from "./SpectatorSetup";
import SpectatorRunning from "./SpectatorRunning";
import SpectatorScoring from "./SpectatorScoring";
import SpectatorScoreBoard from "./SpectatorScoreBoard";
import type {
  GameStatus,
  SpectatorMainQuery,
} from "./__generated__/SpectatorMainQuery.graphql";

const styles: any = {
  root: {
    position: "fixed",
    background: "rgba(0,0,0,0.1)",
    width: "100%",
    height: "100%",
    left: 0,
  },
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
    backgroundColor: "rgba(0,0,0,0.85)",
    border: 0,
    width: "200px",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: "15px",
    textAlign: "center",
    padding: "20px",
    margin: "10px",
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
  playerIcon: {
    width: "200px",
    height: "200px",
    border: 0,
    borderRadius: "15px",
  },
  playerName: {
    display: "block",
    fontSize: "30px",
    color: "white",
  },
  playerStatus: {
    display: "block",
    fontSize: "20px",
    color: "white",
  },
  backgroundVideo: {
    position: "fixed",
    right: 0,
    bottom: 0,
    minWidth: "100%",
    minHeight: "100%",
  },
};

function SpectatorContent() {
  const { t } = useTranslation("referee");
  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription SpectatorMainSubscription {
          active_games_list {
            id
            items {
              ...SpectatorSetup_game
              id
              status
            }
          }
        }
      `,
    }),
    [],
  );
  useSubscription(config);

  const data = useLazyLoadQuery<SpectatorMainQuery>(
    graphql`
      query SpectatorMainQuery {
        active_games_list {
          id
          items {
            ...SpectatorSetup_game
            id
            status
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const items = data?.active_games_list?.items ?? [];
  const activeGame =
    items.length > 0 && items[0]?.status !== "COMPLETE" ? items[0] : null;

  const activeStep: GameStatus =
    activeGame?.status === "SETUP" ||
    activeGame?.status === "REGISTRATION" ||
    activeGame?.status === "RUNNING" ||
    activeGame?.status === "SCORING" ||
    activeGame?.status === "AWARDS"
      ? activeGame.status
      : "COMPLETE";

  const id = activeGame?.id ?? "";

  const backgroundMusic = useRef();
  useEffect(() => {
    const audio: any = document.getElementById("background");
    if (audio == null) {
      return;
    }
    if (activeStep === "COMPLETE") {
      audio.volume = 0.7;
    }
    if (activeStep === "SETUP" || activeStep == "REGISTRATION") {
      audio.volume = 0.1;
    }
    if (activeStep === "SCORING") {
      audio.volume = 0.3;
    }
    if (activeStep === "AWARDS") {
      audio.volume = 0.3;
    }
  }, [activeStep]);
  return (
    <div>
      <video autoPlay muted loop id="myVideo" style={styles.backgroundVideo}>
        <source src="spectator_background.mp4" type="video/mp4" />
      </video>

      {activeStep === "COMPLETE" && (
        <audio autoPlay loop id="background">
          <source src="music/Adventure-320bit.mp3" type="audio/mpeg" />
        </audio>
      )}
      {(activeStep === "SETUP" || activeStep === "REGISTRATION") && (
        <audio autoPlay loop id="background">
          <source src="music/maxkomusic-digital-world.mp3" type="audio/mpeg" />
        </audio>
      )}
      {activeStep === "SCORING" && (
        <audio autoPlay loop id="background">
          <source
            src="music/alexander-nakarada-superepic.mp3"
            type="audio/mpeg"
          />
        </audio>
      )}
      {activeStep === "AWARDS" && (
        <audio autoPlay loop id="background">
          <source src="music/The-Sound-Of-Rain.mp3" type="audio/mpeg" />
        </audio>
      )}
      <div style={styles.root}>
        {activeStep === "COMPLETE" && <SpectatorIdle />}
        {activeStep === "SETUP" && <SpectatorSetup game={activeGame} />}
        {activeStep === "REGISTRATION" && <SpectatorRegistration />}
        {activeStep === "RUNNING" && <SpectatorRunning id={id} />}
        {activeStep === "SCORING" && <SpectatorScoring id={id} />}
        {activeStep === "AWARDS" && <SpectatorScoreBoard id={id} />}
      </div>
    </div>
  );
}

export default function SpectatorMain() {
  return (
    <Suspense fallback={null}>
      <SpectatorContent />
    </Suspense>
  );
}

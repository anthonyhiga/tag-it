import "animate.css";
import { graphql } from "babel-plugin-relay/macro";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery } from "react-relay";
import type { SpectatorRunningQuery } from "./__generated__/SpectatorRunningQuery.graphql";

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
  countdown: {
    width: "50%",
    display: "block",
    fontSize: "300px",
    padding: "10px",
    marginLeft: "200px",
    color: "white",
  },
};
type Props = { id: string };

const FUDGE = 3000;

export default function SpectatorRunning({ id }: Props) {
  const { t } = useTranslation("spectator");

  const data = useLazyLoadQuery<SpectatorRunningQuery>(
    graphql`
      query SpectatorRunningQuery($id: ID!) {
        game_settings(id: $id) {
          countDownSec
          gameLengthInMin
          health
          reloads
          shields
          megatags
          totalTeams
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
    { id },
    { fetchPolicy: "store-and-network" },
  );

  const [clock, setClock] = useState(new Date().getTime());

  const items = data?.active_games_list?.items ?? [];
  const activeGame = items.length > 0 ? items[0] : null;

  const startTime = activeGame?.startedAt ?? "0";
  const startDate = new Date(parseInt(startTime, 10)).getTime();
  const timePassed = Math.floor(clock - startDate);

  const countDown = (data?.game_settings?.countDownSec ?? 0) * 1000 + FUDGE;
  const gameTime = (data?.game_settings?.gameLengthInMin ?? 0) * 60000;
  const totalTime = countDown + gameTime;

  const timeLeft = totalTime - timePassed;
  useEffect(() => {
    if (timeLeft >= 0) {
      const ref = setTimeout(() => setClock(new Date().getTime()), 500);
      return () => {
        clearTimeout(ref);
      };
    }
  }, [timeLeft]);

  const isCountingDown = timePassed < countDown;

  const displayTime = isCountingDown
    ? new Date(countDown - timePassed).toISOString().substr(17, 2)
    : new Date(timeLeft).toISOString().substr(14, 5);

  return (
    <>
      {isCountingDown && countDown - timePassed < 19000 && (
        <audio autoPlay>
          <source src="music/power-charge-6798.mp3" type="audio/mpeg" />
        </audio>
      )}
      {!isCountingDown && (
        <audio autoPlay>
          <source src="music/heavy-beam-weapon-7052.mp3" type="audio/mpeg" />
        </audio>
      )}
      {!isCountingDown && timeLeft < 30000 && (
        <audio autoPlay loop>
          <source src="music/nuclear-alarm-6997.mp3" type="audio/mpeg" />
        </audio>
      )}
      <div style={styles.container}>
        <div
          key={isCountingDown ? "countdown" : "running"}
          style={styles.title}
          className="animate__animated animate__lightSpeedInRight animate_alternate"
        >
          {" "}
          {isCountingDown
            ? t("Game Starting - Point Gun at Sensor")
            : t("Game In Progress")}
        </div>
      </div>
      <br />
      <br />
      <br />
      <div
        key={isCountingDown ? displayTime : ""}
        className={
          isCountingDown
            ? "animate__animated animate__bounce animate__faster"
            : "animate__animated animate__backInUp animate__slower"
        }
        style={styles.countdown}
      >
        {displayTime}
      </div>
    </>
  );
}

import React, { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "animate.css";
import { useFragment } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import type { SpectatorSetup_game$key } from "./__generated__/SpectatorSetup_game.graphql";

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
};

type Props = {
  game: SpectatorSetup_game$key | null;
};

export default function SpectatorSetup({ game }: Props) {
  const { t } = useTranslation("spectator");
  const data = useFragment(
    graphql`
      fragment SpectatorSetup_game on Game {
        name
      }
    `,
    game,
  );
  return (
    <div style={styles.container}>
      <div
        className="animate__animated animate__lightSpeedInRight animate_alternate"
        style={styles.title}
      >
        {data?.name} - {t("Game Setup In Progress - Get Ready to Join")}
      </div>
    </div>
  );
}

import React, { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "animate.css";

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

export default function SpectatorIdle() {
  const { t } = useTranslation("spectator");
  return (
    <div style={styles.container}>
      <div
        className="animate__animated animate__lightSpeedInRight animate_alternate"
        style={styles.title}
      >
        {t("Ask Administrator to Setup a Game")}
      </div>
    </div>
  );
}

/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import AnnouncementIcon from "@material-ui/icons/AnnouncementTwoTone";
import { useTranslation } from "react-i18next";

type Props = { error: string };

const useStyles = makeStyles((theme) => ({
  root: {
    height: "720px",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    flexDirection: "row",
  },
}));

export default function GameWizardError({ error }: Props) {
  const styles = useStyles();
  const { t } = useTranslation("referee");
  return (
    <div className={styles.root}>
      <div className={styles.spinner}>
        <Typography variant="h3">
          <AnnouncementIcon color="error" fontSize="large" />{" "}
          {t("Unable to Load Referee")}
        </Typography>
        <Typography variant="h6">{error}</Typography>
      </div>
    </div>
  );
}

/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "720px",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    flexDirection: "column",
  },
}));

export default function GameWizardLoading() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.spinner}>
        <CircularProgress size={125} />
      </div>
    </div>
  );
}

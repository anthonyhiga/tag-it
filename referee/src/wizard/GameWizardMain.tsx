/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */

import {
  Container,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import GameWizardLoading from "./GameWizardLoading";
import GameWizardScoreBoard from "./GameWizardScoreBoard";
import GameWizardScoring from "./GameWizardScoring";
import GameWizardRunning from "./GameWizardRunning";
import GameWizardRegistration from "./GameWizardRegistration";
import GameWizardSetup from "./GameWizardSetup";
import GameWizardTypeSelector from "./GameWizardTypeSelector";
import type {
  GameStatus,
  GameWizardMainQuery,
} from "./__generated__/GameWizardMainQuery.graphql";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {
    flex: 1,
  },
}));

function WizardStepper({
  activeStep,
  id,
}: {
  activeStep: GameStatus;
  id: string;
}) {
  const stepMap: {
    [K in GameStatus]: number;
  } = {
    "COMPLETE": 0,
    "SETUP": 1,
    "REGISTRATION": 2,
    "RUNNING": 3,
    "SCORING": 4,
    "AWARDS": 5,
    "%future added value": 0,
  };
  const steps = [
    "Select type of Game",
    "Customize your Game",
    "Organize Players",
    "Play!",
    "Collect Player Stats",
    "Scores",
  ];

  return (
    <Stepper activeStep={stepMap[activeStep]}>
      {steps.map((label, index) => {
        const stepProps = {};
        const labelProps = {};
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

function GameWizardContent() {
  const { t } = useTranslation("referee");
  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription GameWizardMainSubscription {
          active_games_list {
            id
            items {
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

  const data = useLazyLoadQuery<GameWizardMainQuery>(
    graphql`
      query GameWizardMainQuery {
        active_games_list {
          id
          items {
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

  return (
    <>
      <WizardStepper activeStep={activeStep} id={id} />
      {activeStep !== "COMPLETE" && (
        <Typography variant="h6">
          {t("GAME: ")}
          {id}
        </Typography>
      )}
      {activeStep === "COMPLETE" && <GameWizardTypeSelector />}
      {activeStep === "SETUP" && <GameWizardSetup id={id} />}
      {activeStep === "REGISTRATION" && <GameWizardRegistration id={id} />}
      {activeStep === "RUNNING" && <GameWizardRunning id={id} />}
      {activeStep === "SCORING" && <GameWizardScoring id={id} />}
      {activeStep === "AWARDS" && <GameWizardScoreBoard id={id} />}
    </>
  );
}

export default function GameWizardMain() {
  const styles = useStyles();
  return (
    <Container className={styles.container}>
      <Suspense fallback={<GameWizardLoading />}>
        <GameWizardContent />
      </Suspense>
    </Container>
  );
}

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
import GameWizardRegistration from "./GameWizardRegistration";
import GameWizardSetup from "./GameWizardSetup";
import GameWizardTypeSelector from "./GameWizardTypeSelector";
import type { GameWizardMainQuery } from "./__generated__/GameWizardMainQuery.graphql";

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

function useSteps() {
  return [
    "Select type of Game",
    "Customize your Game",
    "Organize Players",
    "Play!",
    "Collect Player Stats",
    "Scores",
  ];
}

function WizardStepper({ activeStep, id }: { activeStep: number; id: string }) {
  const steps = useSteps();

  return (
    <Stepper activeStep={activeStep}>
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
              name
              status
              ltId
              startedAt
              completedAt
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
            name
            status
            ltId
            startedAt
            completedAt
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const items = data?.active_games_list?.items ?? [];

  let activeGame = items.length > 0 ? items[0] : null;
  if (activeGame?.status === "COMPLETE") {
    activeGame = null;
  }
  let activeStep = 0;
  if (activeGame && activeGame.status === "SETUP") {
    activeStep = 1;
  } else if (activeGame && activeGame.status === "REGISTRATION") {
    activeStep = 2;
  } else if (activeGame && activeGame.status === "RUNNING") {
    activeStep = 3;
  } else if (activeGame && activeGame.status === "SCORING") {
    activeStep = 4;
  } else if (activeGame && activeGame.status === "AWARDS") {
    activeStep = 5;
  }
  const id = activeGame?.id ?? "";

  return (
    <>
      <WizardStepper activeStep={activeStep} id={id} />
      {activeStep !== 0 && (
        <Typography variant="h6">
          {t("GAME: ")}
          {id}
        </Typography>
      )}
      {activeStep == 0 && <GameWizardTypeSelector />}
      {activeStep == 1 && <GameWizardSetup id={id} />}
      {activeStep == 2 && <GameWizardRegistration id={id} />}
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

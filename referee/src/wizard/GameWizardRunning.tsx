/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { AppBar, Box, Button, Toolbar, Typography } from "@material-ui/core";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useMutation } from "react-relay";
import GameWizardCancelButton from "./GameWizardCancelButton";
import type { GameWizardRunningQuery } from "./__generated__/GameWizardRunningQuery.graphql";

type Props = { id: string };

const FUDGE = 3000;

export default function GameWizardRegistration({ id }: Props) {
  const { t } = useTranslation("referee");

  const [commit] = useMutation(
    graphql`
      mutation GameWizardRunningContinueButtonMutation($id: ID!) {
        continue_game(id: $id) {
          id
        }
      }
    `,
  );

  const onClick = useCallback(() => {
    commit({ variables: { id } });
  }, [id]);

  const data = useLazyLoadQuery<GameWizardRunningQuery>(
    graphql`
      query GameWizardRunningQuery($id: ID!) {
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

  // If we're in the middle of the count down we show something else
  return (
    <>
      {timePassed < countDown ? (
        <Box fontSize={250} justifyContent="center" display="flex">
          {new Date(countDown - timePassed).toISOString().substr(17, 2)}
        </Box>
      ) : (
        <Box fontSize={250} justifyContent="center" display="flex">
          {new Date(timeLeft).toISOString().substr(14, 5)}
        </Box>
      )}
      <Typography variant="h5">
        {t("TOTAL TEAMS")}: {data?.game_settings?.totalTeams ?? 0}
      </Typography>
      <Typography variant="h6">
        {t("HEALTH")}: {data?.game_settings?.health ?? 0}
      </Typography>
      <Typography variant="h6">
        {t("SHIELDS")}: {data?.game_settings?.shields ?? 0}
      </Typography>
      <Typography variant="h6">
        {t("RELOADS")}: {data?.game_settings?.reloads ?? 0}
      </Typography>
      <AppBar
        position="fixed"
        color="primary"
        style={{
          top: "auto",
          bottom: 0,
        }}
      >
        <Toolbar>
          <Box flexGrow={1} />
          <Button variant="contained" onClick={onClick}>
            {t("Continue - Game Has a Winner")}
          </Button>
          <Box sx={{ width: 10 }} />
          <GameWizardCancelButton id={id} />
        </Toolbar>
      </AppBar>
    </>
  );
}

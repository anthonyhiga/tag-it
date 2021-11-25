/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { AppBar, Box, Button, Grid, Slide, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useMutation, useSubscription } from "react-relay";
import GameWizardCancelButton from "./GameWizardCancelButton";
import GameWizardPlayerCard from "./GameWizardPlayerCard";
import type { GameWizardRegistrationPlayerListQuery } from "./__generated__/GameWizardRegistrationPlayerListQuery.graphql";

type Props = { id: string };

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

export default function GameWizardRegistration({ id }: Props) {
  const { t } = useTranslation("referee");
  const [commit] = useMutation(
    graphql`
      mutation GameWizardRegistrationStartButtonMutation($id: ID!) {
        start_game(id: $id) {
          id
        }
      }
    `,
  );

  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription GameWizardRegistrationPlayerListSubscription {
          active_players_list {
            id
            items {
              ...GameWizardPlayerCard_card
              ltTeamId
              ltPlayerId
            }
          }
        }
      `,
    }),
    [],
  );
  useSubscription(config);

  const data = useLazyLoadQuery<GameWizardRegistrationPlayerListQuery>(
    graphql`
      query GameWizardRegistrationPlayerListQuery {
        active_players_list {
          id
          items {
            ...GameWizardPlayerCard_card
            ltTeamId
            ltPlayerId
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const styles = useStyles();
  const players = [...(data?.active_players_list?.items ?? [])];
  players.sort(
    (a, b) =>
      parseInt(a?.ltTeamId ?? "0") - parseInt(b?.ltTeamId ?? "0") ||
      parseInt(a?.ltPlayerId ?? "0") - parseInt(b?.ltPlayerId ?? "0"),
  );

  const onButtonClick = useCallback(() => {
    commit({ variables: { id } });
  }, [id]);

  return (
    <>
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Grid container justify="space-around">
          {players.map((player) => {
            return (
              <Grid item xs>
                <GameWizardPlayerCard player={player} />
              </Grid>
            );
          })}
        </Grid>
      </Slide>
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
          <Button variant="contained" onClick={onButtonClick}>
            {t("Start Game")}
          </Button>
          <Box sx={{ width: 10 }} />
          <GameWizardCancelButton id={id} />
        </Toolbar>
      </AppBar>
    </>
  );
}

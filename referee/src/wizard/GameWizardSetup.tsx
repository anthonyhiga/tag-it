/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import {
  AppBar,
  Box,
  Button,
  Grid,
  TextField,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyLoadQuery, useMutation } from "react-relay";
import type { GameWizardSetupQuery } from "./__generated__/GameWizardSetupQuery.graphql";
import GameWizardCancelButton from "./GameWizardCancelButton";

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

const parseValue = (value: string, max: number): number | null => {
  if (value == null) {
    return null;
  }
  if (value === "") {
    return null;
  }
  const result = parseInt(value, 10);
  if (isNaN(result)) {
    return null;
  }
  if (result > max) {
    return max;
  }
  return result;
};

export default function GameWizardSetup({ id }: Props) {
  const { t } = useTranslation("referee");
  const [commitRegistration] = useMutation(
    graphql`
      mutation GameWizardSetupRegistrationMutation($id: ID!) {
        start_registration(id: $id) {
          id
        }
      }
    `,
  );

  const [commit, isInFlight] = useMutation(
    graphql`
      mutation GameWizardSetupMutation(
        $id: ID!
        $settings: GameSettingsInput!
      ) {
        update_game_settings(id: $id, settings: $settings) {
          id
          gameLengthInMin
          health
          reloads
          shields
          megatags
          totalTeams
        }
      }
    `,
  );

  const data = useLazyLoadQuery<GameWizardSetupQuery>(
    graphql`
      query GameWizardSetupQuery($id: ID!) {
        game_settings(id: $id) {
          gameLengthInMin
          health
          reloads
          shields
          megatags
          totalTeams
        }
      }
    `,
    { id },
    { fetchPolicy: "store-and-network" },
  );

  let team = "solo";
  const totalTeams = data?.game_settings?.totalTeams ?? 0;
  if (totalTeams == 2) {
    team = "2";
  } else if (totalTeams == 3) {
    team = "3";
  }

  const [settings, setSettings] = useState<{
    gameLengthInMin: number | null;
    health: number | null;
    shields: number | null;
    megatags: number | null;
    reloads: number | null;
    totalTeams: number | null;
  }>({
    gameLengthInMin: null,
    health: null,
    shields: null,
    megatags: null,
    reloads: null,
    totalTeams: null,
  });

  useEffect(() => {
    const updatedSettings = data?.game_settings;
    if (updatedSettings != null) {
      setSettings(updatedSettings);
    }
  }, [data?.game_settings]);

  const onButtonClick = useCallback(() => {
    commit({
      variables: {
        id,
        settings,
      },
      onCompleted: () => {
        commitRegistration({ variables: { id } });
      },
    });
  }, [settings, id]);

  const classes = useStyles();
  return (
    <>
      <Box display="flex" flexDirection="column" minHeight={300}>
        <Box flexGrow={1}>
          <Grid alignContent={"flex-end"} className={classes.container}>
            <Box display="flex" height={400} flexDirection="row">
              <Box display="flex" flexDirection="column">
                <TextField
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      gameLengthInMin: parseValue(event.target.value, 30),
                    })
                  }
                  value={settings.gameLengthInMin}
                  label={t("Game Length (min)")}
                  variant="outlined"
                />
                <Box height={10} />
                <TextField
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      health: parseValue(event.target.value, 99),
                    })
                  }
                  value={settings.health}
                  label={t("Health")}
                  variant="outlined"
                />
                <Box height={10} />
                <TextField
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      reloads: parseValue(event.target.value, 99),
                    })
                  }
                  value={settings.reloads}
                  label={t("Reloads")}
                  variant="outlined"
                />
                <Box height={10} />
                <TextField
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      shields: parseValue(event.target.value, 99),
                    })
                  }
                  value={settings.shields}
                  label={t("Shields")}
                  variant="outlined"
                />
                <Box height={10} />
                <TextField
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      megatags: parseValue(event.target.value, 99),
                    })
                  }
                  value={settings.megatags}
                  label={t("Mega-tags")}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>
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
            {t("Start Registration")}
          </Button>
          <Box sx={{ width: 10 }} />
          <GameWizardCancelButton id={id} />
        </Toolbar>
      </AppBar>
    </>
  );
}

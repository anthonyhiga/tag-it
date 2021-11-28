/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Toolbar,
  Typography,
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
          options
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
          options
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
    options: ReadonlyArray<string | null> | null;
  }>({
    gameLengthInMin: null,
    health: null,
    shields: null,
    megatags: null,
    reloads: null,
    totalTeams: null,
    options: null,
  });

  const hasOption = useCallback(
    (name: string): boolean => {
      return (settings.options?.findIndex((item) => item === name) ?? -1) >= 0;
    },
    [settings.options],
  );

  const setOptionList = useCallback(
    (values: Array<{ name: string; enable: boolean }>) => {
      let newOptions = [...(settings.options ?? [])];
      values.forEach((item) => {
        const { name, enable } = item;
        if (enable) {
          if (hasOption(name)) {
            return;
          }

          newOptions.push(name);
        } else {
          newOptions = newOptions.filter((item) => item !== name);
        }
      });
      setSettings({ ...settings, options: newOptions });
    },
    [settings, hasOption],
  );

  const setOption = useCallback(
    (name: string, enable: boolean) => {
      return setOptionList([{ name, enable }]);
    },
    [setOptionList],
  );

  useEffect(() => {
    const updatedSettings = data?.game_settings;
    console.log(updatedSettings);

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
      <br />
      <br />
      <Typography variant="h5">Basic</Typography>
      <br />
      <Grid container spacing={4}>
        <Grid item>
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
        </Grid>
        <Grid item>
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
          <br />
          <Switch
            onChange={(event) => {
              setOption("slow_tags", event.target.checked);
            }}
            checked={hasOption("slow_tags")}
          />
          Limit Damage
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (1 damage every 2 seconds)
          </Typography>
        </Grid>
        <Grid item>
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
          <br />
          <Switch
            onChange={(event) => {
              setOption("limited_reloads", event.target.checked);
            }}
            checked={hasOption("limited_reloads")}
          />
          Limited Reloads
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid>
      <br />
      {totalTeams > 1 && (
        <>
          <br />
          <Typography variant="h5">Team</Typography>
          <br />
          <Grid container spacing={4}>
            <Grid item>
              <Switch
                onChange={(event) => {
                  setOption("team_tags", event.target.checked);
                }}
                checked={hasOption("team_tags")}
              />
              Team Damage
              <br />
              <Typography variant="caption" align="right">
                &nbsp; &nbsp; &nbsp; (Team members able to damage each other)
              </Typography>
            </Grid>
            <Grid item>
              <Switch
                onChange={(event) => {
                  setOption("team_zones", event.target.checked);
                }}
                checked={hasOption("team_zones")}
              />
              Team Zones
              <br />
              <Typography variant="caption" align="right">
                &nbsp; &nbsp; &nbsp; (Zones are associated with teams)
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <br />
      <br />
      <Typography variant="h5">Advanced</Typography>
      <br />
      <Grid container spacing={4}>
        <Grid item>
          <Switch
            onChange={(event) => {
              setOption("contested_zones", event.target.checked);
            }}
            checked={hasOption("contested_zones")}
          />
          Contested Zones
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (Players shot in a contested zone are
            neutralized)
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            onChange={(event) => {
              setOption("hostile_zones", event.target.checked);
            }}
            checked={hasOption("hostile_zones")}
          />
          Hostile Zones
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (Players in a Hostile Zone take damage)
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            onChange={(event) => {
              setOption("unneutralize_supply_zones", event.target.checked);
            }}
            checked={hasOption("unneutralize_supply_zones")}
          />
          Supply Zones Un-neutralize Players
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (Supply zones Un-neutralize players who are
            Neutralized, default Un-neutralize after 15 seconds)
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            onChange={(event) => {
              setOption("refill_tags_supply_zones", event.target.checked);
            }}
            checked={hasOption("refill_tags_supply_zones")}
          />
          Supply Zones Refills Health
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (Supply zones add back health)
          </Typography>
        </Grid>
        <Grid item>
          Neutralize Players
          <br />
          <Typography variant="caption" align="right">
            &nbsp; &nbsp; &nbsp; (Players are unable to shoot when Neutralized)
          </Typography>
          <Box>
            <Radio
              checked={
                !(
                  hasOption("neutralize_10_tags") ||
                  hasOption("neutralize_1_tag")
                )
              }
              onChange={(_event, checked) => {
                if (checked) {
                  setOptionList([
                    { name: "neutralize_1_tag", enable: false },
                    { name: "neutralize_10_tags", enable: false },
                  ]);
                }
              }}
              name="neutralize"
            />{" "}
            Disabled
          </Box>
          <Box>
            <Radio
              checked={hasOption("neutralize_1_tag")}
              name="neutralize"
              onChange={(_event, checked) => {
                if (checked) {
                  setOptionList([
                    { name: "neutralize_1_tag", enable: true },
                    { name: "neutralize_10_tags", enable: false },
                  ]);
                }
              }}
            />{" "}
            After 1 Damage
          </Box>
          <Box>
            <Radio
              checked={hasOption("neutralize_10_tags")}
              onChange={(_event, checked) => {
                if (checked) {
                  setOptionList([
                    { name: "neutralize_1_tag", enable: false },
                    { name: "neutralize_10_tags", enable: true },
                  ]);
                }
              }}
              name="neutralize"
            />{" "}
            After 10 Damage
          </Box>
        </Grid>
        <Grid item>
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
          <br />
          <Switch
            onChange={(event) => {
              setOption("limited_mega_tags", event.target.checked);
            }}
            checked={hasOption("limited_mega_tags")}
          />
          Limited Reloads
        </Grid>
      </Grid>
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

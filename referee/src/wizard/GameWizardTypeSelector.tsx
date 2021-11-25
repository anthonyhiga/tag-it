/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useLazyLoadQuery } from "react-relay";
import GameWizardTypeCard from "./GameWizardTypeCard";
import type { GameWizardTypeSelectorQuery } from "./__generated__/GameWizardTypeSelectorQuery.graphql";

type Props = {};

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

export default function GameWizardTypeSelector() {
  const data = useLazyLoadQuery<GameWizardTypeSelectorQuery>(
    graphql`
      query GameWizardTypeSelectorQuery {
        game_types_list {
          ...GameWizardTypeCard_type
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  return (
    <Grid container spacing={5} justify="space-around">
      {data?.game_types_list?.map((type) => {
        return (
          <Grid item xs>
            <GameWizardTypeCard type={type} />
          </Grid>
        );
      })}
    </Grid>
  );
}

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback } from "react";
import { useFragment, useMutation } from "react-relay";
import type { GameWizardTypeCardMutation } from "./__generated__/GameWizardTypeCardMutation.graphql";
import type { GameWizardTypeCard_type$key } from "./__generated__/GameWizardTypeCard_type.graphql";

type Props = {
  type: GameWizardTypeCard_type$key | null;
};

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    minWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function GameWizardTypeCard({ type }: Props) {
  const [commit, isInFlight] = useMutation<GameWizardTypeCardMutation>(graphql`
    mutation GameWizardTypeCardMutation($type: String!, $name: String!) {
      create_game(type: $type, name: $name) {
        id
      }
    }
  `);

  const data = useFragment(
    graphql`
      fragment GameWizardTypeCard_type on GameType {
        type
        name
        description
        iconUrl
      }
    `,
    type,
  );
  const styles = useStyles();
  const onClick = useCallback(() => {
    if (data?.type != null && data?.name != null) {
      commit({
        variables: { type: data?.type, name: data?.name },
      });
    }
  }, [data?.type, data?.name, commit]);

  return (
    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
      <Card className={styles.card} onClick={onClick}>
        <CardActionArea>
          <CardMedia
            className={styles.media}
            image={data?.iconUrl}
            title={data?.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {data?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {data?.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Zoom>
  );
}

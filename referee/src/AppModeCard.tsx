import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import React from "react";

type Props = {
  onClick: () => void;
  iconUrl: string;
  name: string;
  description: string;
};

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    minWidth: 345,
  },
  media: {
    height: 220,
  },
});

export default function AppModeCard({
  onClick,
  iconUrl,
  name,
  description,
}: Props) {
  const styles = useStyles();
  return (
    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
      <Card className={styles.card} onClick={onClick}>
        <CardActionArea>
          <CardMedia className={styles.media} image={iconUrl} title={name} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Zoom>
  );
}

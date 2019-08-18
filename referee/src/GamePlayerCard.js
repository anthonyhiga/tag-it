import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";
import Zoom from "@material-ui/core/Zoom";
import DoneIcon from "@material-ui/icons/Done";

const avatarWidth = 26;
const width = 180;

const useStyles = makeStyles({
  chip: {
    width: "100%"
  },
  unknown: {
    width
  },
  solocard: {
    backgroundColor: "orange",
    width
  },
  idlecard: {
    backgroundColor: "grey",
    width
  },
  joiningcard: {
    backgroundColor: "white",
    width
  },
  activecard: {
    backgroundColor: "white",
    width
  },
  media: {
    height: 160
  },
  avatar: {
    width: avatarWidth,
    height: avatarWidth
  },
  soloavatar: {
    backgroundColor: "orange",
    width: avatarWidth,
    height: avatarWidth
  },
  team1avatar: {
    backgroundColor: "red",
    width: avatarWidth,
    height: avatarWidth
  },
  team2avatar: {
    backgroundColor: "blue",
    width: avatarWidth,
    height: avatarWidth
  },
  team3avatar: {
    backgroundColor: "yellow",
    width: avatarWidth,
    height: avatarWidth
  }
});

export default function GamePlayerCard(props) {
  const { ltTeamId, status, name, iconUrl, avatarUrl } = props.player;
  const classes = useStyles();

  let cardType = classes.unknown;
  if (status === "IDLE") {
    cardType = classes.idlecard;
  }
  if (status === "JOINING") {
    cardType = classes.joiningcard;
  }
  if (status === "ACTIVE") {
    cardType = classes.activecard;
  }

  let avatarType = classes.avatar;
  if (ltTeamId == 0) {
    avatarType = classes.soloavatar;
  }
  if (ltTeamId == 1) {
    avatarType = classes.team1avatar;
  }
  if (ltTeamId == 2) {
    avatarType = classes.team2avatar;
  }
  if (ltTeamId == 3) {
    avatarType = classes.team3avatar;
  }

  return (
    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
      <Card className={cardType}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={avatarType}>
              {ltTeamId}
            </Avatar>
          }
          title={name}
        />
        <CardActionArea>
          <CardContent>
            <CardMedia
              className={classes.media}
              image={avatarUrl || iconUrl}
              title={name}
            />
            {status === "ACTIVE" ? (
              <Chip
                label="READY!!!!"
                className={classes.chip}
                color="primary"
              />
            ) : (
              <Chip
                label="HOLSTER GUN..."
                className={classes.chip}
                color="secondary"
              />
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Zoom>
  );
}

/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useTranslation } from "react-i18next";
import { useFragment } from "react-relay";
import type { GameWizardPlayerCard_card$key } from "./__generated__/GameWizardPlayerCard_card.graphql";

type Props = {
  player: GameWizardPlayerCard_card$key | null;
};

const avatarWidth = 26;
const width = 180;

const useStyles = makeStyles({
  chip: {
    width: "100%",
  },
  unknown: {
    width,
  },
  solocard: {
    backgroundColor: "orange",
    width,
  },
  idlecard: {
    backgroundColor: "grey",
    width,
  },
  joiningcard: {
    backgroundColor: "white",
    width,
  },
  activecard: {
    backgroundColor: "white",
    width,
  },
  media: {
    height: 160,
  },
  avatar: {
    width: avatarWidth,
    height: avatarWidth,
  },
  soloavatar: {
    backgroundColor: "orange",
    width: avatarWidth,
    height: avatarWidth,
  },
  team1avatar: {
    backgroundColor: "red",
    width: avatarWidth,
    height: avatarWidth,
  },
  team2avatar: {
    backgroundColor: "blue",
    width: avatarWidth,
    height: avatarWidth,
  },
  team3avatar: {
    backgroundColor: "grey",
    width: avatarWidth,
    height: avatarWidth,
  },
});

export default function GameWizardPlayerCard({ player }: Props) {
  const { t } = useTranslation("referee");
  const data = useFragment<GameWizardPlayerCard_card$key>(
    graphql`
      fragment GameWizardPlayerCard_card on GamePlayer {
        status
        ltTeamId
        name
        iconUrl
        avatarUrl
      }
    `,
    player,
  );
  const styles = useStyles();

  let cardType = styles.unknown;
  if (data?.status === "IDLE") {
    cardType = styles.idlecard;
  }
  if (data?.status === "JOINING") {
    cardType = styles.joiningcard;
  }
  if (data?.status === "ACTIVE") {
    cardType = styles.activecard;
  }

  let avatarType = styles.avatar;
  if (data?.ltTeamId === "0") {
    avatarType = styles.soloavatar;
  }
  if (data?.ltTeamId === "1") {
    avatarType = styles.team1avatar;
  }
  if (data?.ltTeamId === "2") {
    avatarType = styles.team2avatar;
  }
  if (data?.ltTeamId === "3") {
    avatarType = styles.team3avatar;
  }

  return (
    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
      <Card className={cardType}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={avatarType}>
              {data?.ltTeamId}
            </Avatar>
          }
          title={data?.name}
        />
        <CardActionArea>
          <CardContent>
            <CardMedia
              className={styles.media}
              image={data?.avatarUrl ?? data?.iconUrl}
              title={data?.name ?? ""}
            />
            {data?.status === "ACTIVE" ? (
              <Chip
                label={t("READY!!!!")}
                className={styles.chip}
                color="primary"
              />
            ) : (
              <Chip
                label={t("HOLSTER GUN...")}
                className={styles.chip}
                color="secondary"
              />
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Zoom>
  );
}

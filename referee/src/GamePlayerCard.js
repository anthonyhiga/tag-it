import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles({
  unknown: {
    maxWidth: 345,
  },
  solocard: {
    backgroundColor: 'orange',
    maxWidth: 345,
  },
  idlecard: {
    backgroundColor: 'grey',
    maxWidth: 345,
  },
  joiningcard: {
    backgroundColor: 'white',
    maxWidth: 345,
  },
  activecard: {
    backgroundColor: '#e5e3fc',
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  avatar: {
  },
  soloavatar: {
    backgroundColor: 'orange',
  },
  team1avatar: {
    backgroundColor: 'red',
  },
  team2avatar: {
    backgroundColor: 'blue',
  },
  team3avatar: {
    backgroundColor: 'yellow',
  },
});


export default function GamePlayerCard(props) {
  const { ltTeamId, ltPlayerId, status, id, name, totemId, iconUrl, avatarUrl } = props.player;
  const classes = useStyles();

  let cardType = classes.unknown;
  if (status === 'IDLE') {
    cardType = classes.idlecard;
  } 
  if (status === 'JOINING') {
    cardType = classes.joiningcard;
  }
  if (status === 'ACTIVE') {
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
    <Zoom in={true} style={{transitionDelay: '500ms'}}>
      <Card className={cardType}>
        <CardHeader avatar={
          <Avatar aria-label="Recipe" className={avatarType}>
            {ltTeamId} 
          </Avatar>
         }
         title={name}
         subheader={id}
       />
      <CardActionArea>
      <CardContent>
      <CardMedia
        className={classes.media}
        image={avatarUrl || iconUrl}
        title={name}
      />
      <Typography variant="body2" color="textSecondary" component="p">
        Player Id: {ltPlayerId}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        Totem Id: {totemId}
      </Typography>
      </CardContent>
      </CardActionArea>
      </Card>
    </Zoom>
  );
}

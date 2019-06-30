import React from 'react';

import {commitMutation} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './SubEnvironment.js';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles({
    card: {
          maxWidth: 345,
        },
    media: {
          height: 140,
        },
});


const createGameQuery = graphql`
mutation GameTypeCardCreateGameMutation($type: String!, $name: String!) {
  create_game(type: $type, name: $name) {
    id
  }
}
`;

const createGame = (type, name) => {
  commitMutation(environment, {mutation: createGameQuery, variables: {type, name}}); 
}      

export default function GameTypeCard(props) { 
    const { type, name, description, iconUrl } = props.gameType;
    const classes = useStyles();
    const selectCard = () => {
      createGame(type, name);
    };

    return (
      <Zoom in={true} style={{transitionDelay: '500ms'}}>
          <Card className={classes.card} onClick={selectCard}> 
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={iconUrl}
                title={name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                   {name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                   {description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
      </Zoom>
        );
}

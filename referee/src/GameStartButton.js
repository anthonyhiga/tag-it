import React from 'react';

import {commitMutation} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './Environment.js';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles({
    card: {
          maxWidth: 345,
        },
    media: {
          height: 140,
        },
});


const query= graphql`
mutation GameStartButtonMutation($id: ID!) {
  start_game(id: $id) {
    id
  }
}
`;

const startGame = (id) => {
  commitMutation(environment, {mutation: query, variables: {id}}); 
}      

export default function GameStartButton(props) { 
    const { id } = props.game;
    const click = () => {
      startGame(id);
    };

    return (
      <Button variant="contained" onClick={click}>Start Game</Button>
    );
}

import React from 'react';

import {commitMutation} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './SubEnvironment.js';

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
mutation GameEndButtonMutation($id: ID!) {
  end_game(id: $id) {
    id
  }
}
`;

const endGame = (id) => {
  commitMutation(environment, {mutation: query, variables: {id}}); 
}      

export default function GameEndButton(props) { 
    const { id } = props.game;
    const click = () => {
      endGame(id);
    };

    return (
      <Button color="primary" variant="contained" onClick={click}>End Game</Button>
    );
}

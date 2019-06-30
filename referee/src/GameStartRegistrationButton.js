import React from 'react';

import {commitMutation} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './SubEnvironment.js';

import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';

const query = graphql`
mutation GameStartRegistrationButtonMutation($id: ID!) {
  start_registration(id: $id) {
    id
  }
}
`;

const startRegistration = (id) => {
  commitMutation(environment, {mutation: query, variables: {id}}); 
}      

export default function GameStartRegistrationButton(props) { 
    const { id } = props.game;
    const click = () => {
      startRegistration(id);
    };

    return (
      <Button color="primary" variant="contained" onClick={click}>Start Registration</Button>
    );
}

import React from 'react';
import logo from './logo.svg';
import {QueryRenderer, requestSubscription} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

//import environment from './Environment.js';
import environment from './SubEnvironment';
import GameWizard from './GameWizard';

import 'typeface-roboto';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  wizard: {
    marginTop: 10,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <GameWizard className={classes.wizard}/>
  );
}

export default App;

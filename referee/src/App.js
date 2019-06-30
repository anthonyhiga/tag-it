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


/*
const query = graphql`
query AppGameTypes {
  game_types_list {
    type
    name
    description
  }
}
`;

/*
      <header className="App-header">
        <Button raised className='button-alternate'
          onClick={() => console.log('clicked!')}>
          Click Me!
        </Button>
        <QueryRenderer
             environment={environment}
             query={query}
             variables = {{id: 17}}
             render={({error, props}) => {
                 if (error) {
                     return <div>Error! {error.toString()}</div>;
                 }
                 if (!props) {
                     return <div>Loading...</div>;
                 }
                 return <div>
                   {
                     props.game_score.map((score) => {
                       return <Score score={score}/>
                     })
                   }
                 </div>;
             }}
          />

      </header>
      */

function App() {
  const classes = useStyles();
  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start"
           className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Tag-It Referee 
        </Typography>
      </Toolbar>
    </AppBar>
    <GameWizard className={classes.wizard}/>
    </>
  );
}

export default App;

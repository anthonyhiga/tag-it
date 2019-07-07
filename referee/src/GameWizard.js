import React from 'react';
import {QueryRenderer, requestSubscription} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './SubEnvironment.js';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import GameTypeCard from './GameTypeCard';
import GamePlayerCard from './GamePlayerCard';
import GameStartRegistrationButton from './GameStartRegistrationButton';
import GameStartButton from './GameStartButton';
import GameEndButton from './GameEndButton';

import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';

const { useState } = React;

const FUDGE = 3000;

const query = graphql`
query GameWizardGameTypesQuery {
  game_types_list {
    type
    name
    description
    iconUrl
  }
}
`

const gameSettingsQuery = graphql`
query GameWizardGameSettingsQuery($id: ID!) {
  game_settings(id: $id) {
    countDownSec
    gameLengthInMin
    health
    reloads
    shields
    megatags
    totalTeams
  }
}
`;

const activeGamesQuery = graphql`
subscription GameWizardActiveGamesSubscription {
  active_games_list {
    id
    name
    status
    ltId
    startedAt
    completedAt
  }
}
`

const activePlayersQuery = graphql`
subscription GameWizardActivePlayersSubscription {
  active_players_list {
    id
    status
    ltTeamId
    ltPlayerId
    name
    totemId
    avatarUrl
    iconUrl
  }
}
`

const reportCheckListQuery = graphql`
subscription GameWizardGameCheckListQuery {
  report_check_list {
    gameId
    ltTeamId
    ltPlayerId
    ltTagTeamId
    type
    status
  }
}
`;


const gameScoreQuery = graphql`
query GameWizardGameScoreQuery($id: ID!) {
  game_score(id: $id) {
    id
    gameId
    teamId
    playerId
    totalTagsReceived
    totalTagsGiven
    survivedTimeSec
    zoneTimeSec
    ltGameId
    ltTeamId
    ltPlayerId
  }
}
`;

requestSubscription(
  environment,
  {
    subscription: activeGamesQuery,
    variables: {},
    onCompleted: () => {},
    onError: error => console.error(error),
  }
);

requestSubscription(
  environment,
  {
    subscription: activePlayersQuery,
    variables: {},
    onCompleted: () => {},
    onError: error => console.error(error),
  }
);

requestSubscription(
  environment,
  {
    subscription: reportCheckListQuery,
    variables: {},
    onCompleted: () => {},
    onError: error => console.error(error),
  }
);

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    flex: 1,
  },
}));

function Transition(props) {
  return (<Slide direction="left" in={true} mountOnEnter unmountOnExit>
    {props.children}
  </Slide>);
}

function getSteps() {
  return [
    'Select type of Game',
    'Customize your Game',
    'Organize Players',
    'Play!',
    'Collect Player Stats',
    'Scores'];
}

function WizardStepper(props) {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <Stepper activeStep={props.activeStep}>
    {steps.map((label, index) => {
      const stepProps = {};
      const labelProps = {};
      return (
        <Step key={label} {...stepProps}>
        <StepLabel {...labelProps}>{label}</StepLabel>
        </Step>
      );
    })}
    </Stepper>
  );
}

const GameTypeSelector = (props) => {
  return (<QueryRenderer
    environment={environment}
    query={query}
    variables = {{}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <Grid container spacing={3}>
        {
          props.game_types_list.map((gameType) => {
            return <Grid item xs={2}>
              <GameTypeCard gameType={gameType}/>
              </Grid>;
          })
        }
        </Grid>;
    }}
    />);
}

const GameSetup = (props) => {
  const classes = useStyles();
  return (
    <Transition>
    <Box display="flex" flexDirection="column" minHeight={300}> 
    <Box flexGrow={1}>
    <Grid alignContent={'flex-end'} className={classes.container}>
    <QueryRenderer
    environment={environment}
    query={gameSettingsQuery}
    variables = {{id: props.game.id}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return (
        <Grid container spacing={3}>
        <Grid item xs={2}>
        <TextField label="Game Length (min)" />
        </Grid>
        <Grid item xs={2}>
        <TextField label="Health" />
        </Grid>
        <Grid item xs={2}>
        <TextField label="Reloads" />
        </Grid>
        <Grid item xs={2}>
        <TextField label="Shields" />
        </Grid>
        <Grid item xs={2}>
        <TextField label="Megatags" />
        </Grid>
        <Grid item xs={2}>
        <TextField label="Total Teams" />
        </Grid>
        </Grid>
      );
    }}
    />
    </Grid>
    </Box>
    <Box/>
    <Box alignItems="flex-end" selfAlign="flex-end" display="flex"> 
    <Box flexGrow={1}/>
    <GameStartRegistrationButton game={props.game}/>
    </Box>
    </Box>
    </Transition>
  )
}

const GameRegistration = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <Transition>
    <Box display="flex" flexDirection="column" minHeight={300}> 
    <Box>
    <QueryRenderer
    environment={environment}
    query={activePlayersQuery}
    variables = {{}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <Grid container spacing={3}>
        {
          props.active_players_list.map((player) => {
            console.log(player)
            return <Grid item xs={3}>
              <GamePlayerCard player={player}/>
              </Grid>;
          })
        }
        </Grid>;
    }}
    />
    </Box>
    <Box/>
    <Box alignItems="flex-end" selfAlign="flex-end" display="flex"> 
    <Box flexGrow={1}/>
    <GameStartButton game={game}/>
    </Box>
    </Box>
    </Transition>
  );
}

const GameCountDown = (props => {
  const [clock, setClock] = useState((new Date()).getTime());

  const game = props.game;
  const startTime = game.startedAt;
  const startDate = (new Date(parseInt(startTime,10))).getTime();
  const timePassed = Math.floor(clock - startDate);

  const countDown = props.settings.countDownSec * 1000 + FUDGE;
  const gameTime = props.settings.gameLengthInMin * 60000;
  const totalTime = countDown + gameTime;

  const timeLeft = (totalTime - timePassed);
  if (timeLeft >= 0) {
    setTimeout(() => {
      const now = (new Date()).getTime()
      setClock(now);
    }, 500);
  }

  // If we're in the middle of the count down we show something else
  if (timePassed < countDown) {
    const countDownLeft = (countDown - timePassed);
    const timeString = new Date(countDownLeft).toISOString().substr(17, 2);
    return <>{timeString}</>;
  } else {
    const timeString = new Date(timeLeft).toISOString().substr(14, 5);
    return <>{timeString}</>;
  }
})

const GameRunning = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <QueryRenderer
    environment={environment}
    query={gameSettingsQuery}
    variables = {{id: props.game.id}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <GameCountDown game={game} settings={props.game_settings}/>;
    }}
    />
  )
}

const GameScoring = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <QueryRenderer
    environment={environment}
    query={reportCheckListQuery}
    variables = {{}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      let count = 0;
      let total = 0;
      props.report_check_list.forEach(item => {
        if (item.status === "COMPLETE") {
          count++;
        }
        total++;
      });

      return <>
        <LinearProgress variant="determinate" value={100 * count/total}/>
        {total - count} out of {total} left
        </>;
    }}
    />
  )
}

const GameScoreBoard = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <QueryRenderer
    environment={environment}
    query={gameScoreQuery}
    variables = {{id: game.id}}
    render={({error, props}) => {
      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      console.warn(props);
      return <><Table size="small">
        <TableHead>
        <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Game ID</TableCell>
        <TableCell>Team ID</TableCell>
        <TableCell>Player ID</TableCell>
        <TableCell>Hits Scored</TableCell>
        <TableCell>Hits Received</TableCell>
        <TableCell>Survival Time</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {props.game_score.map(item => (
          <TableRow>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.gameId}</TableCell>
          <TableCell>{item.ltTeamId}</TableCell>
          <TableCell>{item.ltPlayerId}</TableCell>
          <TableCell>{item.totalTagsGiven}</TableCell>
          <TableCell>{item.totalTagsReceived}</TableCell>
          <TableCell>{item.survivedTimeSec} seconds</TableCell>
          </TableRow>
        ))}
        </TableBody>
        </Table><GameEndButton game={game}/></>;
    }}
    />
  )
}

const GameWizardContent = (props) => {
  switch(props.activeStep) {
    case 0: return <GameTypeSelector/>
    case 1: return <GameSetup game={props.activeGame}/>
    case 2: return <GameRegistration game={props.activeGame}/>
    case 3: return <GameRunning game={props.activeGame}/>
    case 4: return <GameScoring game={props.activeGame}/>
    case 5: return <GameScoreBoard game={props.activeGame}/>
  }

  return null;
}

const GameWizardSteps = (props) => {
  return <QueryRenderer
  environment={environment}
  query={activeGamesQuery}
  variables = {{}}
  render={({error, props}) => {
    if (error) {
      return <div>Unable to Load</div>;
    }
    if (!props) {
      return <div>Loading...</div>;
    }

    const activeGame = props.active_games_list.length > 0 ? props.active_games_list[0] : null;
    let activeStep = 0;

    console.warn(activeGame);

    if (activeGame && activeGame.status === 'SETUP') {
      activeStep = 1;
    }
    else if (activeGame && activeGame.status === 'REGISTRATION') {
      activeStep = 2;
    }
    else if (activeGame && activeGame.status === 'RUNNING') {
      activeStep = 3;
    }
    else if (activeGame && activeGame.status === 'SCORING') {
      activeStep = 4;
    }
    else if (activeGame && activeGame.status === 'AWARDS') {
      activeStep = 5;
    }

    console.log(activeStep);

    return <>
      <WizardStepper activeStep={activeStep}/>
      <GameWizardContent activeStep={activeStep} activeGame={activeGame}/>
      </>;
  }}
    />
}

const GameWizard = (props) => {
  return (
    <Container className={props.className}>
    <GameWizardSteps/>
    </Container>
  );
}


export default GameWizard;

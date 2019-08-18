import React from 'react';
import {QueryRenderer, requestSubscription, commitMutation} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from './Environment.js';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import MobileStepper from '@material-ui/core/MobileStepper';
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
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

const updateSettingsMutation = graphql`
mutation GameWizardUpdateSettingsMutation($id: ID!, $settings: GameSettings!) {
  update_game_settings(id: $id, settings: $settings) {
    id
  }
}
`;

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
    name
    avatarUrl
    iconUrl
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
  game_players_list(id: $id) {
    id
    status
    ltTeamId
    ltPlayerId
    name
    totemId
    avatarUrl
    iconUrl
  }
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

const avatarWidth = 30;

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
  avatar: {
    width: avatarWidth,
    height: avatarWidth,
  },
  soloavatar: {
    backgroundColor: 'orange',
    width: avatarWidth,
    height: avatarWidth,
  },
  team1avatar: {
    backgroundColor: 'red',
    width: avatarWidth,
    height: avatarWidth,
  },
  team2avatar: {
    backgroundColor: 'blue',
    width: avatarWidth,
    height: avatarWidth,
  },
  team3avatar: {
    backgroundColor: 'yellow',
    width: avatarWidth,
    height: avatarWidth,
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
    <MobileStepper 
    steps={steps.length}
    variant="text"
    position="static"
    activeStep={props.activeStep}>
    {steps.map((label, index) => {
      const stepProps = {};
      const labelProps = {};
      return (
        <Step key={label} {...stepProps}>
        <StepLabel {...labelProps}>{label}</StepLabel>
        </Step>
      );
    })}
    </MobileStepper>
  );
}

const GameTypeSelector = (props) => {
  return (<QueryRenderer
    environment={environment}
    query={query}
    variables = {{}}
    render={({error, props}) => {
      if (error) {
        return null;
      }
      if (!props) {
        return null;
      }
      return <Grid container spacing={5} justify="space-around">
        {
          props.game_types_list.map((gameType) => {
            return <Grid item xs>
              <GameTypeCard gameType={gameType}/>
              </Grid>;
          })
        }
        </Grid>;
    }}
    />);
}

const updateSettings = (id, settings) => {
  commitMutation(environment, {mutation: updateSettingsMutation, variables: {id, settings}}); 
}

const parseValue = (value, max) => {
  if (value == null) {
    return "";
  }
  if (value === "") {
    return "";
  }
  const result = parseInt(value, 10);
  if (isNaN(result)) {
    return "";
  }
  if (result > max) {
    return max;
  }
  return result;
}

const GameSettingsEditor = (props) => {
  const settings = props.settings;
  if (settings == null) {
    return null;
  }

  const ns = {...settings};

  let team = "solo";
  const totalTeams = settings.totalTeams;
  if (totalTeams == 2) {
    team = "2"
  } else if (totalTeams == 3) {
    team = "3"
  }

  return (
        <Box display="flex" height={400} flexDirection="row">
          <Box display="flex" flexDirection="column">
            <TextField
             onChange={(event) => {
               ns.gameLengthInMin = parseValue(event.target.value, 30);
               props.setSettings(ns);
             }}
             value={settings.gameLengthInMin} label="Game Length (min)"  variant="outlined"/>
            <Box height={10}/>
            <TextField
             onChange={(event) => {
               ns.health = parseValue(event.target.value, 99);
               props.setSettings(ns);
             }}
             value={settings.health} label="Health" variant="outlined"/>
            <Box height={10}/>
            <TextField
             onChange={(event) => {
               ns.reloads = parseValue(event.target.value, 99);
               props.setSettings(ns);
             }}
             value={settings.reloads}  label="Reloads" variant="outlined"/>
            <Box height={10}/>
            <TextField
             onChange={(event) => {
               ns.shields = parseValue(event.target.value, 99);
               props.setSettings(ns);
             }}
             value={settings.shields} label="Shields" variant="outlined"/>
            <Box height={10}/>
            <TextField
             onChange={(event) => {
               ns.megatags = parseValue(event.target.value, 99);
               props.setSettings(ns);
             }}
             value={settings.megatags} label="Mega-tags" variant="outlined"/>
          </Box>
        </Box>
  );
}

const GameSetup = (props) => {
  const [settings, setSettings] = useState(null);
  const game = props.game;
  const classes = useStyles();
  return (
    <>
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
      if (settings == null) {
        setSettings(props.game_settings);
      }

      return (
        <GameSettingsEditor settings={settings} setSettings={(value) => {
          setSettings(value);
          updateSettings(game.id, value);
        }}/>
      );
    }}
    />
    </Grid>
    </Box>
    </Box>
    <AppBar position="fixed" color="primary" style={{
            top: 'auto',
            bottom: 0,
    }}>
    <Toolbar>
      <Box flexGrow={1}/>
        <GameStartRegistrationButton game={game}/>
    </Toolbar>
    </AppBar>
    </>
  )
}

const GameRegistration = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <>
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
      const players = [...props.active_players_list];
      players.sort((a, b) => (
        a.ltTeamId - b.ltTeamId || a.ltPlayerId - b.ltPlayerId
      ));
      return <Transition>
        <Grid container justify="space-around">
        {
          players.map((player) => {
            return <Grid item xs>
              <GamePlayerCard player={player}/>
              </Grid>;
          })
        }
        </Grid>
        </Transition>
    }}
    />
    <AppBar position="fixed" color="primary" style={{
            top: 'auto',
            bottom: 0,
    }}>
    <Toolbar>
      <Box flexGrow={1}/>
      <GameStartButton edge="end" game={game}/>
    </Toolbar>
    </AppBar>
    </>
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
    return <Box fontSize={250} justifyContent="center" display="flex">{timeString}</Box>;
  } else {
    const timeString = new Date(timeLeft).toISOString().substr(14, 5);
    return <Box fontSize={250} justifyContent="center" display="flex">{timeString}</Box>;
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
        Waiting on {total - count} out of {total} reports - Please bring your Gun to the Sensor
        <Table size="small">
        <TableHead>
        <TableRow>
        <TableCell></TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Team</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Status</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
            {props.report_check_list.filter((a, b) => { 
              return a.status !== "COMPLETE"
            }).map(item => {
          return (<TableRow>
          <TableCell>
            <Avatar src={item.avatarUrl}/>
          </TableCell> 
          <TableCell>
            {item.name}
          </TableCell> 
          <TableCell>
            {item.ltTeamId}
          </TableCell> 
          <TableCell>
            {item.type}
          </TableCell> 
          <TableCell>
            {item.status}
          </TableCell> 
          </TableRow>)
        })}
        </TableBody>
        </Table>
        </>;
    }}
    />
  )
}

const GameScoreTable = ({gameScore, playerMap, teamId, isAlive}) => { 
  return <Table size="small">
        <TableHead>
        <TableRow>
        <TableCell>Icon</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Scored</TableCell>
        <TableCell>Received</TableCell>
        <TableCell>Survived</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {gameScore.map(item => {return item.ltTeamId == teamId ?
          <TableRow>
          <TableCell>
            <Avatar src={playerMap[item.playerId] && playerMap[item.playerId].avatarUrl}/>
          </TableCell> 
          <TableCell>
            {playerMap[item.playerId] && playerMap[item.playerId].name}
          </TableCell> 
          <TableCell>{item.totalTagsGiven}</TableCell>
          <TableCell>{item.totalTagsReceived}</TableCell>
          <TableCell>{item.survivedTimeSec} (s)</TableCell>
          </TableRow> : null;
        })}
        </TableBody>
        </Table>
} 

const GameScoreBoard = (props) => {
  const game = props.game;
  const classes = useStyles();
  return (
    <>
    <QueryRenderer
    environment={environment}
    query={gameScoreQuery}
    variables = {{id: game.id}}
    render={({error, props}) => {
      const avatarMap = (ltTeamId) => {
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
        return avatarType;
      };

      if (error) {
        return <div>Unable to Load</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      const playerMap = {};
      props.game_players_list.forEach(item => {
        if (item != null) { 
          playerMap[item.id] = item;
        }
      });
      const isAlive = (timeLived) => {
        return props.game_settings.gameLengthInMin * 60 <= timeLived;
      }

      const gameScore = [...props.game_score];
      gameScore.sort((a, b) => {
        return b.totalTagsGiven - a.totalTagsGiven || 
        a.totalTagsReceived - b.totalTagsReceived; 
      });

      const teamSummary = [];
      for (let i = 0; i <= 3; i++) {
        let score = 0;
        let players = 0;
        gameScore.forEach(item => {
          if (item.ltTeamId != i) {
            return;
          }
          score += item.totalTagsGiven;
          players++;
        });
        if (players > 0) {
          teamSummary.push({
            teamId: i,
            score,
            players,
          });
        }
      }

      return <Grid container spacing={3} justify="space-around">
        {teamSummary.map((summary) => (
          <Grid item xs>
          <Grid container>
          <Grid item xs>
          <Avatar aria-label="Recipe" className={avatarMap(summary.teamId)}>
            {summary.teamId} 
          </Avatar>
          </Grid>
          <Grid item xs>
          Team {summary.teamId} Score: {summary.score}
          </Grid>
          </Grid>
          <GameScoreTable 
            teamId={summary.teamId}
            gameScore={gameScore}
            playerMap={playerMap}
            isAlive={isAlive}
            />
          </Grid>
        ))}
      </Grid>
    }}
    />
    <AppBar position="fixed" color="primary" style={{
            top: 'auto',
            bottom: 0,
    }}>
    <Toolbar>
      <Box flexGrow={1}/>
      <GameEndButton game={game}/>
    </Toolbar>
    </AppBar>
    </>
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

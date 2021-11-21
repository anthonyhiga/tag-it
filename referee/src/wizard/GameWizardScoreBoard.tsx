/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  graphql,
  requestSubscription,
  commitMutation,
  useLazyLoadQuery,
} from "react-relay";

const avatarWidth = 30;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
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
    textAlign: "center",
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
    backgroundColor: "yellow",
    width: avatarWidth,
    height: avatarWidth,
  },
}));

export default function GameScoreBoard(props) {
  const data = useLazyLoadQuery(
    graphql`
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
    `,
    { id: 4 },
    { fetchPolicy: "store-or-network" }
  );

  const game = props.game;
  const classes = useStyles();
  return (
    <>
      <QueryRenderer
        environment={environment}
        query={gameScoreQuery}
        variables={{ id: game.id }}
        render={({ error, props }) => {
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
          props.game_players_list.forEach((item) => {
            if (item != null) {
              playerMap[item.id] = item;
            }
          });
          const isAlive = (timeLived) => {
            return props.game_settings.gameLengthInMin * 60 <= timeLived;
          };

          const gameScore = [...props.game_score];
          gameScore.sort((a, b) => {
            return (
              b.totalTagsGiven - a.totalTagsGiven ||
              a.totalTagsReceived - b.totalTagsReceived
            );
          });

          const teamSummary = [];
          for (let i = 0; i <= 3; i++) {
            let score = 0;
            let players = 0;
            gameScore.forEach((item) => {
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

          return (
            <Grid container spacing={3} justify="space-around">
              {teamSummary.map((summary) => (
                <Grid item xs>
                  <Grid container>
                    <Grid item xs>
                      <Avatar
                        aria-label="Recipe"
                        className={avatarMap(summary.teamId)}
                      >
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
          );
        }}
      />
      <AppBar
        position="fixed"
        color="primary"
        style={{
          top: "auto",
          bottom: 0,
        }}
      >
        <Toolbar>
          <Box flexGrow={1} />
          <GameEndButton game={game} />
        </Toolbar>
      </AppBar>
    </>
  );
}

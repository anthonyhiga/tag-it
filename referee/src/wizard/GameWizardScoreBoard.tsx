/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import React, { useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  requestSubscription,
  commitMutation,
  useLazyLoadQuery,
} from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import {
  AppBar,
  Avatar,
  Box,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Toolbar,
  GridSize,
  Typography,
} from "@material-ui/core";
import GameWizardCancelButton from "./GameWizardCancelButton";
import type {
  GameWizardScoreBoardQuery,
  PlayerStatus,
} from "./__generated__/GameWizardScoreBoardQuery.graphql";

type Props = {
  id: string;
};

type PlayerRecord = {
  readonly id: string;
  readonly status: PlayerStatus;
  readonly ltTeamId: string | null;
  readonly ltPlayerId: string | null;
  readonly name: string | null;
  readonly totemId: string;
  readonly avatarUrl: string;
  readonly iconUrl: string;
};

type ScoreRecord = {
  readonly id: string;
  readonly gameId: string;
  readonly teamId: string | null;
  readonly playerId: string | null;
  readonly totalTagsReceived: number;
  readonly totalTagsGiven: number;
  readonly survivedTimeSec: number;
  readonly zoneTimeSec: number;
  readonly ltGameId: string;
  readonly ltTeamId: string;
  readonly ltPlayerId: string;
};

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
    backgroundColor: "grey",
    width: avatarWidth,
    height: avatarWidth,
  },
}));

export default function GameWizardScoreBoard({ id }: Props) {
  const data = useLazyLoadQuery<GameWizardScoreBoardQuery>(
    graphql`
      query GameWizardScoreBoardQuery($id: ID!) {
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
          items {
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
    { id },
    { fetchPolicy: "store-and-network" },
  );

  const styles = useStyles();
  const avatarMap = useCallback(
    (ltTeamId: number) => {
      let avatarType = styles.avatar;
      if (ltTeamId == 0) {
        avatarType = styles.soloavatar;
      }
      if (ltTeamId == 1) {
        avatarType = styles.team1avatar;
      }
      if (ltTeamId == 2) {
        avatarType = styles.team2avatar;
      }
      if (ltTeamId == 3) {
        avatarType = styles.team3avatar;
      }
      return avatarType;
    },
    [styles],
  );

  const isAlive = useCallback(
    (timeLived: number): boolean => {
      return (data?.game_settings?.gameLengthInMin ?? 0) * 60 <= timeLived;
    },
    [data?.game_settings?.gameLengthInMin],
  );

  const playerMap = useMemo(() => {
    const result: {
      [id: string]: PlayerRecord;
    } = {};

    data?.game_players_list?.items?.forEach((item) => {
      if (item != null) {
        result[item.id] = item;
      }
    });
    return result;
  }, [data?.game_players_list?.items]);

  const {
    mvpWinningScore,
    gameScore,
    teamWinningScore,
    teamTotalWinners,
    teamSummary,
  } = useMemo(() => {
    const gameScore = [...(data.game_score ?? [])];
    gameScore.sort((a, b) => {
      if (a == null || b == null) {
        return 0;
      }
      return (
        b.totalTagsGiven - a.totalTagsGiven ||
        a.totalTagsReceived - b.totalTagsReceived
      );
    });

    let teamWinningScore: number = 0;
    let teamTotalWinners: number = 0;
    let mvpWinningScore: number = -10000;

    const teamSummary = [];
    for (let i = 0; i <= 3; i++) {
      let score = 0;
      let players = 0;
      gameScore.forEach((item) => {
        if (item?.ltTeamId != i.toString()) {
          return;
        }
        score += item.totalTagsGiven;
        const mvpScore = item.totalTagsGiven - item.totalTagsReceived;
        if (mvpScore > mvpWinningScore) {
          mvpWinningScore = mvpScore;
        }
        players++;
      });
      if (score > teamWinningScore) {
        teamWinningScore = score;
      }
      if (players > 0) {
        teamSummary.push({
          teamId: i,
          score,
          players,
        });
      }
    }

    teamSummary.forEach((team) => {
      if (team.score === teamWinningScore) {
        teamTotalWinners++;
      }
    });

    return {
      mvpWinningScore,
      teamSummary,
      gameScore,
      teamTotalWinners,
      teamWinningScore,
    };
  }, [data?.game_score]);

  let cols: GridSize = 12;
  switch (teamSummary.length) {
    case 1:
      cols = 12;
      break;
    case 2:
      cols = 6;
      break;
    case 3:
      cols = 4;
      break;
  }

  return (
    <>
      <br />
      <br />
      <Grid container spacing={4} justify="space-around">
        {teamSummary.map((summary) => (
          <Grid item xs={cols}>
            {teamSummary.length > 1 && (
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
                  <Typography variant="h5">
                    Team {summary.teamId} - Score: {summary.score}
                    {summary.score === teamWinningScore
                      ? teamTotalWinners > 1
                        ? "(Tie)"
                        : "(Winner)"
                      : null}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Injured</TableCell>
                  <TableCell>Lifespan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameScore.map((item) => {
                  if (item?.playerId == null) {
                    return null;
                  }
                  const player = playerMap[item.playerId];
                  return item.ltTeamId == summary.teamId.toString() ? (
                    <TableRow>
                      <TableCell>
                        <Avatar src={player?.avatarUrl} />
                      </TableCell>
                      <TableCell>
                        {player?.name}
                        {item.totalTagsGiven - item.totalTagsReceived ===
                          mvpWinningScore && " (MVP)"}
                      </TableCell>
                      <TableCell>{item.totalTagsGiven}</TableCell>
                      <TableCell>{item.totalTagsReceived}</TableCell>
                      <TableCell>{item.survivedTimeSec}(s)</TableCell>
                    </TableRow>
                  ) : null;
                })}
              </TableBody>
            </Table>
          </Grid>
        ))}
      </Grid>
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
          <GameWizardCancelButton id={id} end={true} />
        </Toolbar>
      </AppBar>
    </>
  );
}

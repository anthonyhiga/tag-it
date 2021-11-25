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
} from "@material-ui/core";
import GameEndButton from "../GameEndButton";
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
    backgroundColor: "yellow",
    width: avatarWidth,
    height: avatarWidth,
  },
}));

const GameScoreTable = ({
  gameScore,
  playerMap,
  teamId,
  isAlive,
}: {
  gameScore: (ScoreRecord | null)[];
  playerMap: { [id: string]: PlayerRecord };
  teamId: string;
  isAlive: (timeLived: number) => boolean;
}) => {
  return (
    <Table size="small">
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
        {gameScore.map((item) => {
          if (item?.playerId == null) {
            return null;
          }
          const player = playerMap[item.playerId];
          return item.ltTeamId == teamId ? (
            <TableRow>
              <TableCell>
                <Avatar src={player?.avatarUrl} />
              </TableCell>
              <TableCell>{player?.name}</TableCell>
              <TableCell>{item.totalTagsGiven}</TableCell>
              <TableCell>{item.totalTagsReceived}</TableCell>
              <TableCell>{item.survivedTimeSec} (s)</TableCell>
            </TableRow>
          ) : null;
        })}
      </TableBody>
    </Table>
  );
};

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

  const classes = useStyles();
  const avatarMap = (ltTeamId: number) => {
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

  const playerMap: {
    [id: string]: PlayerRecord;
  } = {};
  data?.game_players_list?.items?.forEach((item) => {
    if (item != null) {
      playerMap[item.id] = item;
    }
  });
  const isAlive = (timeLived: number): boolean => {
    return (data?.game_settings?.gameLengthInMin ?? 0) * 60 <= timeLived;
  };

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

  const teamSummary = [];
  for (let i = 0; i <= 3; i++) {
    let score = 0;
    let players = 0;
    gameScore.forEach((item) => {
      if (item?.ltTeamId != i.toString()) {
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
    <>
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
              teamId={summary.teamId.toString()}
              gameScore={gameScore}
              playerMap={playerMap}
              isAlive={isAlive}
            />
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
          <GameEndButton game={{ id }} />
        </Toolbar>
      </AppBar>
    </>
  );
}

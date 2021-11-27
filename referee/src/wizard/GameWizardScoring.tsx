/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import {
  AppBar,
  Avatar,
  Box,
  Grid,
  GridSize,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { graphql } from "babel-plugin-relay/macro";
import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import GameWizardCancelButton from "./GameWizardCancelButton";
import type {
  GameWizardScoringQuery,
  ReportStatusType,
} from "./__generated__/GameWizardScoringQuery.graphql";

type Props = { id: string };

export default function GameWizardScoring({ id }: Props) {
  const { t } = useTranslation("referee");
  const data = useLazyLoadQuery<GameWizardScoringQuery>(
    graphql`
      query GameWizardScoringQuery {
        report_check_list {
          id
          items {
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
        active_games_list {
          id
          items {
            id
            status
            startedAt
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const config = useMemo(
    () => ({
      config: {},
      variables: {},
      subscription: graphql`
        subscription GameWizardScoringSubscription {
          report_check_list {
            id
            items {
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
        }
      `,
    }),
    [],
  );
  useSubscription(config);

  const [clock, setClock] = useState(new Date().getTime());

  const items = data?.active_games_list?.items ?? [];
  const activeGame = items.length > 0 ? items[0] : null;

  const startTime = activeGame?.startedAt ?? "0";
  const startDate = new Date(parseInt(startTime, 10)).getTime();

  const reportCheckList: {
    [id: string]: {
      id: string;
      ltTeamId: string | number;
      recordedReports: number;
      totalReports: number;
      status: ReportStatusType;
      name: string | null;
      avatarUrl: string | null;
      iconUrl: string | null;
    };
  } = {};

  let teamCount = 0;
  data?.report_check_list?.items?.forEach((item) => {
    const id = item?.ltTeamId + ":" + item?.ltPlayerId;
    let listItem = reportCheckList[id];
    if (listItem == null && item != null) {
      const teamId = parseInt(item?.ltTeamId ?? "1");
      if (teamId > teamCount) {
        teamCount = teamId;
      }

      reportCheckList[id] = {
        ...item,
        id,
        totalReports: 0,
        recordedReports: 0,
        ltTeamId: teamId,
      };
      listItem = reportCheckList[id];
    }

    // Pending always trumps everything
    if (item?.status == "PENDING") {
      listItem.status = "PENDING";
    } else {
      listItem.recordedReports++;
    }

    listItem.totalReports++;
  });

  const teams = [];
  for (let i = 1; i <= teamCount; i++) {
    teams.push(i);
  }

  const reportList = Object.values(reportCheckList);

  let count = 0;
  let total = reportList.length;
  reportList.forEach((item) => {
    if (item?.status === "PENDING") {
      count++;
    }
  });

  let cols: GridSize = 12;
  switch (teamCount) {
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

  const players = total - count;
  return (
    <>
      <Typography variant="h4">
        <Trans>
          Waiting on {players} out of {total} players
        </Trans>
      </Typography>
      <br />
      <Typography variant="h5">
        <Trans>
          Please bring your GUN to the SENSOR so we can record your score
        </Trans>
      </Typography>
      <Grid container spacing={2}>
        {teams.map((i) => (
          <Grid item xs={cols}>
            <Typography variant="h6">{t("Team: ") + i}</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{t("Waiting On")}</TableCell>
                  <TableCell>{t("Searching For...")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportList
                  ?.filter((a, b) => {
                    return a?.status !== "COMPLETE" && a?.ltTeamId === i;
                  })
                  .map((item) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <Avatar src={item?.avatarUrl ?? ""} />
                        </TableCell>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell>
                          {item?.recordedReports}/{item?.totalReports}
                        </TableCell>
                        <TableCell>
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Grid>
        ))}
      </Grid>
      <br />
      <br />
      <br />
      {players !== 0 && (
        <>
          <Typography variant="h5">
            <Trans>
              Your score has been recorded, you may now shut off your GUN.
            </Trans>
          </Typography>
          <Grid container spacing={2}>
            {teams.map((i) => (
              <Grid item xs={cols}>
                <Typography variant="h6">{t("Team: ") + i}</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>{t("Name")}</TableCell>
                      <TableCell>{t("Waited On")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportList
                      ?.filter((item) => {
                        return (
                          item?.status === "COMPLETE" && item?.ltTeamId === i
                        );
                      })
                      .map((item) => {
                        return (
                          <TableRow>
                            <TableCell>
                              <Avatar src={item?.avatarUrl ?? ""} />
                            </TableCell>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>
                              {item?.recordedReports}/{item?.totalReports}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Grid>
            ))}
          </Grid>
        </>
      )}
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
          <GameWizardCancelButton id={id} />
        </Toolbar>
      </AppBar>
    </>
  );
}

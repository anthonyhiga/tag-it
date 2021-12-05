/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { AppBar, Toolbar, Grid, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RelayEnvironmentProvider } from "react-relay";
import "typeface-roboto";
import environment from "./Environment";
import GameWizardMain from "./wizard/GameWizardMain";
import GameWizardError from "./wizard/GameWizardError";
import SpectatorMain from "./spectator/SpectatorMain";
import AppModeCard from "./AppModeCard";
import { refereeImage, spectatorImage } from "./AppIcons";

type ErrorProps = {};
type ErrorState = { hasError: boolean; error: string };

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <GameWizardError error={this.state.error} />;
    }

    return this.props.children;
  }
}

function App() {
  const { t } = useTranslation("referee");
  const [mode, setMode] = useState("");
  const onClickBack = useCallback(() => setMode(""), [setMode]);
  const onClickWizard = useCallback(() => setMode("WIZARD"), [setMode]);
  const onClickSpectator = useCallback(() => setMode("SPECTATOR"), [setMode]);
  return (
    <RelayEnvironmentProvider environment={environment}>
      {mode !== "SPECTATOR" && (
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h5">{t("Tag - IT Referee")}</Typography>
            {mode !== "" && <Button onClick={onClickBack}>Main</Button>}
          </Toolbar>
        </AppBar>
      )}
      <ErrorBoundary>
        {mode === "" && (
          <>
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={3} justify="space-around">
              <Grid item>
                <AppModeCard
                  onClick={onClickWizard}
                  name={t("Administrator")}
                  description={t("Create and Officiate Games")}
                  iconUrl={refereeImage}
                />
              </Grid>
              <Grid item>
                <AppModeCard
                  onClick={onClickSpectator}
                  name={t("Spectator")}
                  description={t(
                    "Display Game Status on a Larger Non-interactive Display",
                  )}
                  iconUrl={spectatorImage}
                />
              </Grid>
            </Grid>
          </>
        )}
        {mode === "WIZARD" && <GameWizardMain />}
        {mode === "SPECTATOR" && <SpectatorMain />}
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}

export default App;

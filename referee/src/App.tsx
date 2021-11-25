/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { RelayEnvironmentProvider } from "react-relay";
import "typeface-roboto";
import environment from "./Environment";
import GameWizardMain from "./wizard/GameWizardMain";
import GameWizardError from "./wizard/GameWizardError";

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
  return (
    <RelayEnvironmentProvider environment={environment}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h5">{t("Tag - IT Referee")}</Typography>
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <GameWizardMain />
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
}

export default App;

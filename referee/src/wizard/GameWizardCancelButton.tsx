/**
 * Project Tag-It
 *
 * License: Apache v2.0
 */

import Button from "@material-ui/core/Button";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-relay";

type Props = { id: string };

export default function GameWizardCancelButton({ id }: Props) {
  const { t } = useTranslation("referee");
  const [commit] = useMutation(
    graphql`
      mutation GameWizardCancelButtonMutation($id: ID!) {
        cancel_game(id: $id) {
          id
        }
      }
    `,
  );
  const onClick = useCallback(() => {
    commit({ variables: { id } });
  }, [id]);

  return (
    <Button variant="contained" onClick={onClick}>
      {t("Cancel")}
    </Button>
  );
}

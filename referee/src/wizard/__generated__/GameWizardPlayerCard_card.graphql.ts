/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type GameWizardPlayerCard_card = {
    readonly status: PlayerStatus;
    readonly ltTeamId: string | null;
    readonly name: string | null;
    readonly iconUrl: string;
    readonly avatarUrl: string;
    readonly " $refType": "GameWizardPlayerCard_card";
};
export type GameWizardPlayerCard_card$data = GameWizardPlayerCard_card;
export type GameWizardPlayerCard_card$key = {
    readonly " $data"?: GameWizardPlayerCard_card$data;
    readonly " $fragmentRefs": FragmentRefs<"GameWizardPlayerCard_card">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GameWizardPlayerCard_card",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "ltTeamId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "iconUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "GamePlayer",
  "abstractKey": null
};
(node as any).hash = 'dab20ed8c408d5bd63e7433e6f82eec1';
export default node;

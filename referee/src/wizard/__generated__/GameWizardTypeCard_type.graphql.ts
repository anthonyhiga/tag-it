/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GameWizardTypeCard_type = {
    readonly type: string;
    readonly name: string;
    readonly description: string;
    readonly iconUrl: string;
    readonly " $refType": "GameWizardTypeCard_type";
};
export type GameWizardTypeCard_type$data = GameWizardTypeCard_type;
export type GameWizardTypeCard_type$key = {
    readonly " $data"?: GameWizardTypeCard_type$data;
    readonly " $fragmentRefs": FragmentRefs<"GameWizardTypeCard_type">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GameWizardTypeCard_type",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "iconUrl",
      "storageKey": null
    }
  ],
  "type": "GameType",
  "abstractKey": null
};
(node as any).hash = 'ffb5290059a3c1d68113fcd46927aa2c';
export default node;

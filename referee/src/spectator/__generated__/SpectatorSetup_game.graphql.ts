/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SpectatorSetup_game = {
    readonly name: string | null;
    readonly " $refType": "SpectatorSetup_game";
};
export type SpectatorSetup_game$data = SpectatorSetup_game;
export type SpectatorSetup_game$key = {
    readonly " $data"?: SpectatorSetup_game$data;
    readonly " $fragmentRefs": FragmentRefs<"SpectatorSetup_game">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SpectatorSetup_game",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Game",
  "abstractKey": null
};
(node as any).hash = '215293938be5466327261983790b734a';
export default node;

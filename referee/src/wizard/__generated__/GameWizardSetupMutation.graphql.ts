/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameSettingsInput = {
    countDownSec?: number | null;
    gameLengthInMin?: number | null;
    health?: number | null;
    reloads?: number | null;
    shields?: number | null;
    megatags?: number | null;
    totalTeams?: number | null;
    options?: Array<string | null> | null;
};
export type GameWizardSetupMutationVariables = {
    id: string;
    settings: GameSettingsInput;
};
export type GameWizardSetupMutationResponse = {
    readonly update_game_settings: {
        readonly id: string;
        readonly gameLengthInMin: number | null;
        readonly health: number | null;
        readonly reloads: number | null;
        readonly shields: number | null;
        readonly megatags: number | null;
        readonly totalTeams: number | null;
    } | null;
};
export type GameWizardSetupMutation = {
    readonly response: GameWizardSetupMutationResponse;
    readonly variables: GameWizardSetupMutationVariables;
};



/*
mutation GameWizardSetupMutation(
  $id: ID!
  $settings: GameSettingsInput!
) {
  update_game_settings(id: $id, settings: $settings) {
    id
    gameLengthInMin
    health
    reloads
    shields
    megatags
    totalTeams
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "settings"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "settings",
        "variableName": "settings"
      }
    ],
    "concreteType": "GameSettings",
    "kind": "LinkedField",
    "name": "update_game_settings",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "gameLengthInMin",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "health",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reloads",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "shields",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "megatags",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalTeams",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardSetupMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardSetupMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7d2670273b0c6d4115e01b5708ffb09a",
    "id": null,
    "metadata": {},
    "name": "GameWizardSetupMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardSetupMutation(\n  $id: ID!\n  $settings: GameSettingsInput!\n) {\n  update_game_settings(id: $id, settings: $settings) {\n    id\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n  }\n}\n"
  }
};
})();
(node as any).hash = '40fa20567ca70a77056735c65802cec1';
export default node;

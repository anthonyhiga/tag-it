/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardSetupQueryVariables = {
    id: string;
};
export type GameWizardSetupQueryResponse = {
    readonly game_settings: {
        readonly gameLengthInMin: number | null;
        readonly health: number | null;
        readonly reloads: number | null;
        readonly shields: number | null;
        readonly megatags: number | null;
        readonly totalTeams: number | null;
    } | null;
};
export type GameWizardSetupQuery = {
    readonly response: GameWizardSetupQueryResponse;
    readonly variables: GameWizardSetupQueryVariables;
};



/*
query GameWizardSetupQuery(
  $id: ID!
) {
  game_settings(id: $id) {
    gameLengthInMin
    health
    reloads
    shields
    megatags
    totalTeams
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "gameLengthInMin",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "health",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reloads",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shields",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "megatags",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalTeams",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardSetupQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "GameSettings",
        "kind": "LinkedField",
        "name": "game_settings",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardSetupQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "GameSettings",
        "kind": "LinkedField",
        "name": "game_settings",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "be4d922ae0daab6f993f77bf52aa2f1a",
    "id": null,
    "metadata": {},
    "name": "GameWizardSetupQuery",
    "operationKind": "query",
    "text": "query GameWizardSetupQuery(\n  $id: ID!\n) {\n  game_settings(id: $id) {\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '325cf5ca008ed512e0ef46d348d4603f';
export default node;

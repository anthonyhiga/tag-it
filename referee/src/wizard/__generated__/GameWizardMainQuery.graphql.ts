/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type GameWizardMainQueryVariables = {};
export type GameWizardMainQueryResponse = {
    readonly active_games_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly id: string;
            readonly name: string | null;
            readonly status: GameStatus;
            readonly ltId: string;
            readonly startedAt: string | null;
            readonly completedAt: string | null;
        } | null> | null;
    } | null;
};
export type GameWizardMainQuery = {
    readonly response: GameWizardMainQueryResponse;
    readonly variables: GameWizardMainQueryVariables;
};



/*
query GameWizardMainQuery {
  active_games_list {
    id
    items {
      id
      name
      status
      ltId
      startedAt
      completedAt
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "GameList",
    "kind": "LinkedField",
    "name": "active_games_list",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Game",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
          (v0/*: any*/),
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
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ltId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardMainQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GameWizardMainQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5bfe65917af2a265fcc734c12c34d94e",
    "id": null,
    "metadata": {},
    "name": "GameWizardMainQuery",
    "operationKind": "query",
    "text": "query GameWizardMainQuery {\n  active_games_list {\n    id\n    items {\n      id\n      name\n      status\n      ltId\n      startedAt\n      completedAt\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'eac1cc480500920307a9b683aa88a94e';
export default node;

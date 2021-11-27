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
    "cacheID": "3c72b50461ca045d525bc1defbee53f4",
    "id": null,
    "metadata": {},
    "name": "GameWizardMainQuery",
    "operationKind": "query",
    "text": "query GameWizardMainQuery {\n  active_games_list {\n    id\n    items {\n      id\n      name\n      status\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '0c1cb7463acb92cc85eac1f3980ac0e8';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type GameWizardMainSubscriptionVariables = {};
export type GameWizardMainSubscriptionResponse = {
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
export type GameWizardMainSubscription = {
    readonly response: GameWizardMainSubscriptionResponse;
    readonly variables: GameWizardMainSubscriptionVariables;
};



/*
subscription GameWizardMainSubscription {
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
    "name": "GameWizardMainSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GameWizardMainSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bcf7a5e261bc45b9d15925c5fb19db51",
    "id": null,
    "metadata": {},
    "name": "GameWizardMainSubscription",
    "operationKind": "subscription",
    "text": "subscription GameWizardMainSubscription {\n  active_games_list {\n    id\n    items {\n      id\n      name\n      status\n      ltId\n      startedAt\n      completedAt\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '3e355302335b6c4fa0ea2ecfc11c2129';
export default node;

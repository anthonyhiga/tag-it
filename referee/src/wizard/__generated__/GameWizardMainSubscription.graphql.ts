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
            readonly status: GameStatus;
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
    "cacheID": "a24077e134ae1e97cc25958411ba6f44",
    "id": null,
    "metadata": {},
    "name": "GameWizardMainSubscription",
    "operationKind": "subscription",
    "text": "subscription GameWizardMainSubscription {\n  active_games_list {\n    id\n    items {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '36a5a8db86143574672fdb972aa3b658';
export default node;

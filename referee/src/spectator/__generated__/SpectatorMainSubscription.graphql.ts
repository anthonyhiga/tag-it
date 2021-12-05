/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type SpectatorMainSubscriptionVariables = {};
export type SpectatorMainSubscriptionResponse = {
    readonly active_games_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly id: string;
            readonly status: GameStatus;
            readonly " $fragmentRefs": FragmentRefs<"SpectatorSetup_game">;
        } | null> | null;
    } | null;
};
export type SpectatorMainSubscription = {
    readonly response: SpectatorMainSubscriptionResponse;
    readonly variables: SpectatorMainSubscriptionVariables;
};



/*
subscription SpectatorMainSubscription {
  active_games_list {
    id
    items {
      ...SpectatorSetup_game
      id
      status
    }
  }
}

fragment SpectatorSetup_game on Game {
  name
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorMainSubscription",
    "selections": [
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
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SpectatorSetup_game"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SpectatorMainSubscription",
    "selections": [
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5f6889a9b538c88653e82530f451e089",
    "id": null,
    "metadata": {},
    "name": "SpectatorMainSubscription",
    "operationKind": "subscription",
    "text": "subscription SpectatorMainSubscription {\n  active_games_list {\n    id\n    items {\n      ...SpectatorSetup_game\n      id\n      status\n    }\n  }\n}\n\nfragment SpectatorSetup_game on Game {\n  name\n}\n"
  }
};
})();
(node as any).hash = 'c910db247daf0fe250d1b7fa21926b2b';
export default node;

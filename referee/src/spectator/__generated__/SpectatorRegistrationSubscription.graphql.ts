/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type SpectatorRegistrationSubscriptionVariables = {};
export type SpectatorRegistrationSubscriptionResponse = {
    readonly active_players_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly status: PlayerStatus;
            readonly ltTeamId: string | null;
            readonly name: string | null;
            readonly iconUrl: string;
            readonly avatarUrl: string;
        } | null> | null;
    } | null;
};
export type SpectatorRegistrationSubscription = {
    readonly response: SpectatorRegistrationSubscriptionResponse;
    readonly variables: SpectatorRegistrationSubscriptionVariables;
};



/*
subscription SpectatorRegistrationSubscription {
  active_players_list {
    id
    items {
      status
      ltTeamId
      name
      iconUrl
      avatarUrl
      id
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltTeamId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "iconUrl",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorRegistrationSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GamePlayerList",
        "kind": "LinkedField",
        "name": "active_players_list",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GamePlayer",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
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
    "name": "SpectatorRegistrationSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GamePlayerList",
        "kind": "LinkedField",
        "name": "active_players_list",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GamePlayer",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8dafb82ec99cf4d7d1b5d210ab499347",
    "id": null,
    "metadata": {},
    "name": "SpectatorRegistrationSubscription",
    "operationKind": "subscription",
    "text": "subscription SpectatorRegistrationSubscription {\n  active_players_list {\n    id\n    items {\n      status\n      ltTeamId\n      name\n      iconUrl\n      avatarUrl\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '37485a4a32eef094c0c81d5109bcd15f';
export default node;

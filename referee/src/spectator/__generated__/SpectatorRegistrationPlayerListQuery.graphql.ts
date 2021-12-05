/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type SpectatorRegistrationPlayerListQueryVariables = {};
export type SpectatorRegistrationPlayerListQueryResponse = {
    readonly active_players_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly id: string;
            readonly status: PlayerStatus;
            readonly ltTeamId: string | null;
            readonly name: string | null;
            readonly iconUrl: string;
            readonly avatarUrl: string;
        } | null> | null;
    } | null;
};
export type SpectatorRegistrationPlayerListQuery = {
    readonly response: SpectatorRegistrationPlayerListQueryResponse;
    readonly variables: SpectatorRegistrationPlayerListQueryVariables;
};



/*
query SpectatorRegistrationPlayerListQuery {
  active_players_list {
    id
    items {
      id
      status
      ltTeamId
      name
      iconUrl
      avatarUrl
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
          (v0/*: any*/),
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
            "name": "ltTeamId",
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
            "name": "iconUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "avatarUrl",
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
    "name": "SpectatorRegistrationPlayerListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SpectatorRegistrationPlayerListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "01fd24f5e586f75f9ebf2a5b6404ee09",
    "id": null,
    "metadata": {},
    "name": "SpectatorRegistrationPlayerListQuery",
    "operationKind": "query",
    "text": "query SpectatorRegistrationPlayerListQuery {\n  active_players_list {\n    id\n    items {\n      id\n      status\n      ltTeamId\n      name\n      iconUrl\n      avatarUrl\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '038392f696803fc81f46ff9ae6f5e032';
export default node;

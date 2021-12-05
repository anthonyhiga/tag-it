/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type SpectatorRunningQueryVariables = {
    id: string;
};
export type SpectatorRunningQueryResponse = {
    readonly game_settings: {
        readonly countDownSec: number | null;
        readonly gameLengthInMin: number | null;
        readonly health: number | null;
        readonly reloads: number | null;
        readonly shields: number | null;
        readonly megatags: number | null;
        readonly totalTeams: number | null;
    } | null;
    readonly active_games_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly id: string;
            readonly status: GameStatus;
            readonly startedAt: string | null;
        } | null> | null;
    } | null;
};
export type SpectatorRunningQuery = {
    readonly response: SpectatorRunningQueryResponse;
    readonly variables: SpectatorRunningQueryVariables;
};



/*
query SpectatorRunningQuery(
  $id: ID!
) {
  game_settings(id: $id) {
    countDownSec
    gameLengthInMin
    health
    reloads
    shields
    megatags
    totalTeams
    id
  }
  active_games_list {
    id
    items {
      id
      status
      startedAt
    }
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
  "name": "countDownSec",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "gameLengthInMin",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "health",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reloads",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shields",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "megatags",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalTeams",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "GameList",
  "kind": "LinkedField",
  "name": "active_games_list",
  "plural": false,
  "selections": [
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Game",
      "kind": "LinkedField",
      "name": "items",
      "plural": true,
      "selections": [
        (v9/*: any*/),
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
          "name": "startedAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorRunningQuery",
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
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      (v10/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SpectatorRunningQuery",
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
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "storageKey": null
      },
      (v10/*: any*/)
    ]
  },
  "params": {
    "cacheID": "a9b65a6bc91e28f0665c6ec3890b487f",
    "id": null,
    "metadata": {},
    "name": "SpectatorRunningQuery",
    "operationKind": "query",
    "text": "query SpectatorRunningQuery(\n  $id: ID!\n) {\n  game_settings(id: $id) {\n    countDownSec\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n    id\n  }\n  active_games_list {\n    id\n    items {\n      id\n      status\n      startedAt\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c0ee1d16eea0f82682c60bf96f8741a6';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type GameWizardScoreBoardQueryVariables = {
    id: string;
};
export type GameWizardScoreBoardQueryResponse = {
    readonly game_score: ReadonlyArray<{
        readonly id: string;
        readonly gameId: string;
        readonly teamId: string | null;
        readonly playerId: string | null;
        readonly totalTagsReceived: number;
        readonly totalTagsGiven: number;
        readonly survivedTimeSec: number;
        readonly zoneTimeSec: number;
        readonly ltGameId: string;
        readonly ltTeamId: string;
        readonly ltPlayerId: string;
    } | null> | null;
    readonly game_players_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly id: string;
            readonly status: PlayerStatus;
            readonly ltTeamId: string | null;
            readonly ltPlayerId: string | null;
            readonly name: string | null;
            readonly totemId: string;
            readonly avatarUrl: string;
            readonly iconUrl: string;
        } | null> | null;
    } | null;
    readonly game_settings: {
        readonly countDownSec: number | null;
        readonly gameLengthInMin: number | null;
        readonly health: number | null;
        readonly reloads: number | null;
        readonly shields: number | null;
        readonly megatags: number | null;
        readonly totalTeams: number | null;
    } | null;
};
export type GameWizardScoreBoardQuery = {
    readonly response: GameWizardScoreBoardQueryResponse;
    readonly variables: GameWizardScoreBoardQueryVariables;
};



/*
query GameWizardScoreBoardQuery(
  $id: ID!
) {
  game_score(id: $id) {
    id
    gameId
    teamId
    playerId
    totalTagsReceived
    totalTagsGiven
    survivedTimeSec
    zoneTimeSec
    ltGameId
    ltTeamId
    ltPlayerId
  }
  game_players_list(id: $id) {
    id
    items {
      id
      status
      ltTeamId
      ltPlayerId
      name
      totemId
      avatarUrl
      iconUrl
    }
  }
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
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltTeamId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltPlayerId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": (v1/*: any*/),
  "concreteType": "GamePlayerScore",
  "kind": "LinkedField",
  "name": "game_score",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "gameId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "teamId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "playerId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalTagsReceived",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalTagsGiven",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "survivedTimeSec",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "zoneTimeSec",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "ltGameId",
      "storageKey": null
    },
    (v3/*: any*/),
    (v4/*: any*/)
  ],
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": (v1/*: any*/),
  "concreteType": "GamePlayerList",
  "kind": "LinkedField",
  "name": "game_players_list",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "GamePlayer",
      "kind": "LinkedField",
      "name": "items",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        },
        (v3/*: any*/),
        (v4/*: any*/),
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
          "name": "totemId",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatarUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "iconUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "countDownSec",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "gameLengthInMin",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "health",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reloads",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "shields",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "megatags",
  "storageKey": null
},
v13 = {
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
    "name": "GameWizardScoreBoardQuery",
    "selections": [
      (v5/*: any*/),
      (v6/*: any*/),
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "GameSettings",
        "kind": "LinkedField",
        "name": "game_settings",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/)
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
    "name": "GameWizardScoreBoardQuery",
    "selections": [
      (v5/*: any*/),
      (v6/*: any*/),
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "GameSettings",
        "kind": "LinkedField",
        "name": "game_settings",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6e02f6e2e29b0da6c6fa26a37dbde94b",
    "id": null,
    "metadata": {},
    "name": "GameWizardScoreBoardQuery",
    "operationKind": "query",
    "text": "query GameWizardScoreBoardQuery(\n  $id: ID!\n) {\n  game_score(id: $id) {\n    id\n    gameId\n    teamId\n    playerId\n    totalTagsReceived\n    totalTagsGiven\n    survivedTimeSec\n    zoneTimeSec\n    ltGameId\n    ltTeamId\n    ltPlayerId\n  }\n  game_players_list(id: $id) {\n    id\n    items {\n      id\n      status\n      ltTeamId\n      ltPlayerId\n      name\n      totemId\n      avatarUrl\n      iconUrl\n    }\n  }\n  game_settings(id: $id) {\n    countDownSec\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'f874da591c2f125214ee59c2bc1c7970';
export default node;

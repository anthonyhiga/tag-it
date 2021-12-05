/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type ReportStatusType = "COMPLETE" | "PENDING" | "%future added value";
export type ReportType = "BASIC" | "TEAM" | "%future added value";
export type SpectatorScoringQueryVariables = {};
export type SpectatorScoringQueryResponse = {
    readonly report_check_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly gameId: string;
            readonly ltTeamId: string;
            readonly ltPlayerId: string;
            readonly ltTagTeamId: string | null;
            readonly type: ReportType;
            readonly status: ReportStatusType;
            readonly name: string | null;
            readonly avatarUrl: string | null;
            readonly iconUrl: string | null;
        } | null> | null;
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
export type SpectatorScoringQuery = {
    readonly response: SpectatorScoringQueryResponse;
    readonly variables: SpectatorScoringQueryVariables;
};



/*
query SpectatorScoringQuery {
  report_check_list {
    id
    items {
      gameId
      ltTeamId
      ltPlayerId
      ltTagTeamId
      type
      status
      name
      avatarUrl
      iconUrl
    }
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
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ReportCheckList",
    "kind": "LinkedField",
    "name": "report_check_list",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "ReportCheckListItem",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
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
            "name": "ltTeamId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ltPlayerId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ltTagTeamId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          (v1/*: any*/),
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorScoringQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SpectatorScoringQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ee5bef36a4397956ca364793af63f27a",
    "id": null,
    "metadata": {},
    "name": "SpectatorScoringQuery",
    "operationKind": "query",
    "text": "query SpectatorScoringQuery {\n  report_check_list {\n    id\n    items {\n      gameId\n      ltTeamId\n      ltPlayerId\n      ltTagTeamId\n      type\n      status\n      name\n      avatarUrl\n      iconUrl\n    }\n  }\n  active_games_list {\n    id\n    items {\n      id\n      status\n      startedAt\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '9022d42265f2017040091f2e9ef2c14d';
export default node;

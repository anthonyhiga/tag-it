/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ReportStatusType = "COMPLETE" | "PENDING" | "%future added value";
export type ReportType = "BASIC" | "TEAM" | "%future added value";
export type SpectatorScoringSubscriptionVariables = {};
export type SpectatorScoringSubscriptionResponse = {
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
};
export type SpectatorScoringSubscription = {
    readonly response: SpectatorScoringSubscriptionResponse;
    readonly variables: SpectatorScoringSubscriptionVariables;
};



/*
subscription SpectatorScoringSubscription {
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
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ReportCheckList",
    "kind": "LinkedField",
    "name": "report_check_list",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorScoringSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SpectatorScoringSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "17670eb1afe1d94154cc2769fbd5f0bd",
    "id": null,
    "metadata": {},
    "name": "SpectatorScoringSubscription",
    "operationKind": "subscription",
    "text": "subscription SpectatorScoringSubscription {\n  report_check_list {\n    id\n    items {\n      gameId\n      ltTeamId\n      ltPlayerId\n      ltTagTeamId\n      type\n      status\n      name\n      avatarUrl\n      iconUrl\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '29f65578ae48adee8bf9e37e81b54346';
export default node;

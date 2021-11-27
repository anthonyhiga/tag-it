/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ReportStatusType = "COMPLETE" | "PENDING" | "%future added value";
export type ReportType = "BASIC" | "TEAM" | "%future added value";
export type GameWizardScoringSubscriptionVariables = {};
export type GameWizardScoringSubscriptionResponse = {
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
export type GameWizardScoringSubscription = {
    readonly response: GameWizardScoringSubscriptionResponse;
    readonly variables: GameWizardScoringSubscriptionVariables;
};



/*
subscription GameWizardScoringSubscription {
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
    "name": "GameWizardScoringSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GameWizardScoringSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "461d2695d0d4a1ad66248dcbdbeddd8c",
    "id": null,
    "metadata": {},
    "name": "GameWizardScoringSubscription",
    "operationKind": "subscription",
    "text": "subscription GameWizardScoringSubscription {\n  report_check_list {\n    id\n    items {\n      gameId\n      ltTeamId\n      ltPlayerId\n      ltTagTeamId\n      type\n      status\n      name\n      avatarUrl\n      iconUrl\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'bdf71ea34ec4ac388f1409b22b955b25';
export default node;

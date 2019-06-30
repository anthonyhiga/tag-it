/**
 * @flow
 * @relayHash 9782510b6b50bc21ccdc8bc823c60541
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ReportStatusType = "COMPLETE" | "PENDING" | "%future added value";
export type ReportType = "BASIC" | "TEAM" | "%future added value";
export type GameWizardGameCheckListQueryVariables = {||};
export type GameWizardGameCheckListQueryResponse = {|
  +report_check_list: ?$ReadOnlyArray<?{|
    +gameId: string,
    +ltTeamId: string,
    +ltPlayerId: string,
    +ltTagTeamId: ?string,
    +type: ReportType,
    +status: ReportStatusType,
  |}>
|};
export type GameWizardGameCheckListQuery = {|
  variables: GameWizardGameCheckListQueryVariables,
  response: GameWizardGameCheckListQueryResponse,
|};
*/


/*
subscription GameWizardGameCheckListQuery {
  report_check_list {
    gameId
    ltTeamId
    ltPlayerId
    ltTagTeamId
    type
    status
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "report_check_list",
    "storageKey": null,
    "args": null,
    "concreteType": "ReportCheckListItem",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "gameId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltTeamId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltPlayerId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltTagTeamId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "type",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "status",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "GameWizardGameCheckListQuery",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardGameCheckListQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "GameWizardGameCheckListQuery",
    "id": null,
    "text": "subscription GameWizardGameCheckListQuery {\n  report_check_list {\n    gameId\n    ltTeamId\n    ltPlayerId\n    ltTagTeamId\n    type\n    status\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ff74aeb04376f77329334f2f43c10e9e';
module.exports = node;

/**
 * @flow
 * @relayHash df4216f4b66ac16b7b9c7b5668b8a90f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameStatus = "AWARDS" | "COMPLETE" | "REGISTRATION" | "RUNNING" | "SCORING" | "SETUP" | "%future added value";
export type GameWizardActiveGamesSubscriptionVariables = {||};
export type GameWizardActiveGamesSubscriptionResponse = {|
  +active_games_list: ?$ReadOnlyArray<?{|
    +id: string,
    +name: ?string,
    +status: GameStatus,
    +ltId: string,
    +startedAt: ?string,
    +completedAt: ?string,
  |}>
|};
export type GameWizardActiveGamesSubscription = {|
  variables: GameWizardActiveGamesSubscriptionVariables,
  response: GameWizardActiveGamesSubscriptionResponse,
|};
*/


/*
subscription GameWizardActiveGamesSubscription {
  active_games_list {
    id
    name
    status
    ltId
    startedAt
    completedAt
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "active_games_list",
    "storageKey": null,
    "args": null,
    "concreteType": "Game",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "name",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "status",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "startedAt",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "completedAt",
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
    "name": "GameWizardActiveGamesSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardActiveGamesSubscription",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "GameWizardActiveGamesSubscription",
    "id": null,
    "text": "subscription GameWizardActiveGamesSubscription {\n  active_games_list {\n    id\n    name\n    status\n    ltId\n    startedAt\n    completedAt\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cfdc08053b5940218595f40f6e8e0a42';
module.exports = node;

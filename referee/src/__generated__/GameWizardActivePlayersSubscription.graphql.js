/**
 * @flow
 * @relayHash 143ab1292c227e0fe1d2338549c00744
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type GameWizardActivePlayersSubscriptionVariables = {||};
export type GameWizardActivePlayersSubscriptionResponse = {|
  +active_players_list: ?$ReadOnlyArray<?{|
    +id: string,
    +status: PlayerStatus,
    +ltTeamId: ?string,
    +ltPlayerId: ?string,
    +name: ?string,
    +totemId: string,
    +avatarUrl: string,
    +iconUrl: string,
  |}>
|};
export type GameWizardActivePlayersSubscription = {|
  variables: GameWizardActivePlayersSubscriptionVariables,
  response: GameWizardActivePlayersSubscriptionResponse,
|};
*/


/*
subscription GameWizardActivePlayersSubscription {
  active_players_list {
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "active_players_list",
    "storageKey": null,
    "args": null,
    "concreteType": "Player",
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
        "name": "status",
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
        "name": "name",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totemId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "iconUrl",
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
    "name": "GameWizardActivePlayersSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardActivePlayersSubscription",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "GameWizardActivePlayersSubscription",
    "id": null,
    "text": "subscription GameWizardActivePlayersSubscription {\n  active_players_list {\n    id\n    status\n    ltTeamId\n    ltPlayerId\n    name\n    totemId\n    avatarUrl\n    iconUrl\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aeafe868ea356efe2e721e07f22d548c';
module.exports = node;

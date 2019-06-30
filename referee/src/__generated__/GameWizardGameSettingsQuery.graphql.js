/**
 * @flow
 * @relayHash 158c19726260295091c3ee99b39a383c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameWizardGameSettingsQueryVariables = {|
  id: string
|};
export type GameWizardGameSettingsQueryResponse = {|
  +game_settings: ?{|
    +countDownSec: ?number,
    +gameLengthInMin: ?number,
    +health: ?number,
    +reloads: ?number,
    +shields: ?number,
    +megatags: ?number,
    +totalTeams: ?number,
  |}
|};
export type GameWizardGameSettingsQuery = {|
  variables: GameWizardGameSettingsQueryVariables,
  response: GameWizardGameSettingsQueryResponse,
|};
*/


/*
query GameWizardGameSettingsQuery(
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
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game_settings",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "CurrentGameSettings",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "countDownSec",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "gameLengthInMin",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "health",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "reloads",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "shields",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "megatags",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totalTeams",
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
    "name": "GameWizardGameSettingsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardGameSettingsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "GameWizardGameSettingsQuery",
    "id": null,
    "text": "query GameWizardGameSettingsQuery(\n  $id: ID!\n) {\n  game_settings(id: $id) {\n    countDownSec\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '305a5903f17e839d342d5268ca004555';
module.exports = node;

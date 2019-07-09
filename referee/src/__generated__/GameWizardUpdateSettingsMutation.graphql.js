/**
 * @flow
 * @relayHash 545f2de6befd1a17d519bc8c920b6c05
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameSettings = {|
  countDownSec?: ?number,
  gameLengthInMin?: ?number,
  health?: ?number,
  reloads?: ?number,
  shields?: ?number,
  megatags?: ?number,
  totalTeams?: ?number,
  options?: ?$ReadOnlyArray<?string>,
|};
export type GameWizardUpdateSettingsMutationVariables = {|
  id: string,
  settings: GameSettings,
|};
export type GameWizardUpdateSettingsMutationResponse = {|
  +update_game_settings: ?{|
    +id: string
  |}
|};
export type GameWizardUpdateSettingsMutation = {|
  variables: GameWizardUpdateSettingsMutationVariables,
  response: GameWizardUpdateSettingsMutationResponse,
|};
*/


/*
mutation GameWizardUpdateSettingsMutation(
  $id: ID!
  $settings: GameSettings!
) {
  update_game_settings(id: $id, settings: $settings) {
    id
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
  },
  {
    "kind": "LocalArgument",
    "name": "settings",
    "type": "GameSettings!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "update_game_settings",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "settings",
        "variableName": "settings"
      }
    ],
    "concreteType": "Game",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
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
    "name": "GameWizardUpdateSettingsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardUpdateSettingsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameWizardUpdateSettingsMutation",
    "id": null,
    "text": "mutation GameWizardUpdateSettingsMutation(\n  $id: ID!\n  $settings: GameSettings!\n) {\n  update_game_settings(id: $id, settings: $settings) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '92884122443ffabeb39a4120da258e29';
module.exports = node;

/**
 * @flow
 * @relayHash fe46c8a26a92b4c07781cff17b45256b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameStartRegistrationButtonMutationVariables = {|
  id: string
|};
export type GameStartRegistrationButtonMutationResponse = {|
  +start_registration: ?{|
    +id: string
  |}
|};
export type GameStartRegistrationButtonMutation = {|
  variables: GameStartRegistrationButtonMutationVariables,
  response: GameStartRegistrationButtonMutationResponse,
|};
*/


/*
mutation GameStartRegistrationButtonMutation(
  $id: ID!
) {
  start_registration(id: $id) {
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
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "start_registration",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
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
    "name": "GameStartRegistrationButtonMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameStartRegistrationButtonMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameStartRegistrationButtonMutation",
    "id": null,
    "text": "mutation GameStartRegistrationButtonMutation(\n  $id: ID!\n) {\n  start_registration(id: $id) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f3c0f3801ca1180094acf863eafdd5d7';
module.exports = node;

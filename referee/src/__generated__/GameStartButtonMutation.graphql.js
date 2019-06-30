/**
 * @flow
 * @relayHash db64d04cdb41be067e7dbf68a1d2c0e2
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameStartButtonMutationVariables = {|
  id: string
|};
export type GameStartButtonMutationResponse = {|
  +start_game: ?{|
    +id: string
  |}
|};
export type GameStartButtonMutation = {|
  variables: GameStartButtonMutationVariables,
  response: GameStartButtonMutationResponse,
|};
*/


/*
mutation GameStartButtonMutation(
  $id: ID!
) {
  start_game(id: $id) {
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
    "name": "start_game",
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
    "name": "GameStartButtonMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameStartButtonMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameStartButtonMutation",
    "id": null,
    "text": "mutation GameStartButtonMutation(\n  $id: ID!\n) {\n  start_game(id: $id) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'eb290dc796e5455d20bd9ebd53dbb1b1';
module.exports = node;

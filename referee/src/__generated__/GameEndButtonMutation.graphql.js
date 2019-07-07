/**
 * @flow
 * @relayHash 8a9dad6fadc9f841aef472d627f715ca
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameEndButtonMutationVariables = {|
  id: string
|};
export type GameEndButtonMutationResponse = {|
  +end_game: ?{|
    +id: string
  |}
|};
export type GameEndButtonMutation = {|
  variables: GameEndButtonMutationVariables,
  response: GameEndButtonMutationResponse,
|};
*/


/*
mutation GameEndButtonMutation(
  $id: ID!
) {
  end_game(id: $id) {
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
    "name": "end_game",
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
    "name": "GameEndButtonMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameEndButtonMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameEndButtonMutation",
    "id": null,
    "text": "mutation GameEndButtonMutation(\n  $id: ID!\n) {\n  end_game(id: $id) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '73b4c6f96803a8a69cf1e491d1c852a4';
module.exports = node;

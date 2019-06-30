/**
 * @flow
 * @relayHash 38e9a0c0170d6655c40168cad2af9f25
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameTypeCardCreateGameMutationVariables = {|
  type: string,
  name: string,
|};
export type GameTypeCardCreateGameMutationResponse = {|
  +create_game: ?{|
    +id: string
  |}
|};
export type GameTypeCardCreateGameMutation = {|
  variables: GameTypeCardCreateGameMutationVariables,
  response: GameTypeCardCreateGameMutationResponse,
|};
*/


/*
mutation GameTypeCardCreateGameMutation(
  $type: String!
  $name: String!
) {
  create_game(type: $type, name: $name) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "type",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "name",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "create_game",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "type",
        "variableName": "type"
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
    "name": "GameTypeCardCreateGameMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameTypeCardCreateGameMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameTypeCardCreateGameMutation",
    "id": null,
    "text": "mutation GameTypeCardCreateGameMutation(\n  $type: String!\n  $name: String!\n) {\n  create_game(type: $type, name: $name) {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '355eeb26aa5f1d35c8e7c135a6a260b7';
module.exports = node;

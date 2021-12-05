/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SpectatorScoreBoardButtonMutationVariables = {
    id: string;
};
export type SpectatorScoreBoardButtonMutationResponse = {
    readonly end_game: {
        readonly id: string;
    } | null;
};
export type SpectatorScoreBoardButtonMutation = {
    readonly response: SpectatorScoreBoardButtonMutationResponse;
    readonly variables: SpectatorScoreBoardButtonMutationVariables;
};



/*
mutation SpectatorScoreBoardButtonMutation(
  $id: ID!
) {
  end_game(id: $id) {
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Game",
    "kind": "LinkedField",
    "name": "end_game",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SpectatorScoreBoardButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SpectatorScoreBoardButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "364c02d859fd7e70d2982829af9e9e01",
    "id": null,
    "metadata": {},
    "name": "SpectatorScoreBoardButtonMutation",
    "operationKind": "mutation",
    "text": "mutation SpectatorScoreBoardButtonMutation(\n  $id: ID!\n) {\n  end_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '02398fc9a379a5e3eee4b075132abbc2';
export default node;

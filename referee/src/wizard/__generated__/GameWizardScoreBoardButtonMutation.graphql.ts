/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardScoreBoardButtonMutationVariables = {
    id: string;
};
export type GameWizardScoreBoardButtonMutationResponse = {
    readonly end_game: {
        readonly id: string;
    } | null;
};
export type GameWizardScoreBoardButtonMutation = {
    readonly response: GameWizardScoreBoardButtonMutationResponse;
    readonly variables: GameWizardScoreBoardButtonMutationVariables;
};



/*
mutation GameWizardScoreBoardButtonMutation(
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
    "name": "GameWizardScoreBoardButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardScoreBoardButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08f5c58f9d0bfc98e9eb803f2a0b8028",
    "id": null,
    "metadata": {},
    "name": "GameWizardScoreBoardButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardScoreBoardButtonMutation(\n  $id: ID!\n) {\n  end_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '473acc8d3685282e296531db53344ba2';
export default node;

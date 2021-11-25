/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardCancelButtonMutationVariables = {
    id: string;
};
export type GameWizardCancelButtonMutationResponse = {
    readonly end_game: {
        readonly id: string;
    } | null;
};
export type GameWizardCancelButtonMutation = {
    readonly response: GameWizardCancelButtonMutationResponse;
    readonly variables: GameWizardCancelButtonMutationVariables;
};



/*
mutation GameWizardCancelButtonMutation(
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
    "name": "GameWizardCancelButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardCancelButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ff398c96e3ca2d173d284c18d76d2d0f",
    "id": null,
    "metadata": {},
    "name": "GameWizardCancelButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardCancelButtonMutation(\n  $id: ID!\n) {\n  end_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '2143da614a6b7c354648dce01277cd82';
export default node;

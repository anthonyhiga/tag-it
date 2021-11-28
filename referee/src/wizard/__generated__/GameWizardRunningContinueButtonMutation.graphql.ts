/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardRunningContinueButtonMutationVariables = {
    id: string;
};
export type GameWizardRunningContinueButtonMutationResponse = {
    readonly continue_game: {
        readonly id: string;
    } | null;
};
export type GameWizardRunningContinueButtonMutation = {
    readonly response: GameWizardRunningContinueButtonMutationResponse;
    readonly variables: GameWizardRunningContinueButtonMutationVariables;
};



/*
mutation GameWizardRunningContinueButtonMutation(
  $id: ID!
) {
  continue_game(id: $id) {
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
    "name": "continue_game",
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
    "name": "GameWizardRunningContinueButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardRunningContinueButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "66d9648895c652355544835d43a6b35a",
    "id": null,
    "metadata": {},
    "name": "GameWizardRunningContinueButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardRunningContinueButtonMutation(\n  $id: ID!\n) {\n  continue_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '857f3970c194e75bde54454fc4cf8d9f';
export default node;

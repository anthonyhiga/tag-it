/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardCancelButtonMutationVariables = {
    id: string;
};
export type GameWizardCancelButtonMutationResponse = {
    readonly cancel_game: {
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
  cancel_game(id: $id) {
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
    "name": "cancel_game",
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
    "cacheID": "9bd088ee24eaf04fc261896744938cf0",
    "id": null,
    "metadata": {},
    "name": "GameWizardCancelButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardCancelButtonMutation(\n  $id: ID!\n) {\n  cancel_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '471b5a4d9286c79f60b3c71e3f79b997';
export default node;

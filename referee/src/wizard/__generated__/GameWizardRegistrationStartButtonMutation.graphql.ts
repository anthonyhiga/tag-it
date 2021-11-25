/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardRegistrationStartButtonMutationVariables = {
    id: string;
};
export type GameWizardRegistrationStartButtonMutationResponse = {
    readonly start_game: {
        readonly id: string;
    } | null;
};
export type GameWizardRegistrationStartButtonMutation = {
    readonly response: GameWizardRegistrationStartButtonMutationResponse;
    readonly variables: GameWizardRegistrationStartButtonMutationVariables;
};



/*
mutation GameWizardRegistrationStartButtonMutation(
  $id: ID!
) {
  start_game(id: $id) {
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
    "name": "start_game",
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
    "name": "GameWizardRegistrationStartButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardRegistrationStartButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "750431538f98aecc59fe8784a6d8c186",
    "id": null,
    "metadata": {},
    "name": "GameWizardRegistrationStartButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardRegistrationStartButtonMutation(\n  $id: ID!\n) {\n  start_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'da627b5aad7bdabb464041236dbc4e73';
export default node;

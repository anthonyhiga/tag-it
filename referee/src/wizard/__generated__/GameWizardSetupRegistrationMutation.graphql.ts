/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardSetupRegistrationMutationVariables = {
    id: string;
};
export type GameWizardSetupRegistrationMutationResponse = {
    readonly start_registration: {
        readonly id: string;
    } | null;
};
export type GameWizardSetupRegistrationMutation = {
    readonly response: GameWizardSetupRegistrationMutationResponse;
    readonly variables: GameWizardSetupRegistrationMutationVariables;
};



/*
mutation GameWizardSetupRegistrationMutation(
  $id: ID!
) {
  start_registration(id: $id) {
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
    "name": "start_registration",
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
    "name": "GameWizardSetupRegistrationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardSetupRegistrationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "213b96e3376b73d46ff0873c7eb35a9f",
    "id": null,
    "metadata": {},
    "name": "GameWizardSetupRegistrationMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardSetupRegistrationMutation(\n  $id: ID!\n) {\n  start_registration(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '14f82b3da4f1ac0a3f0570bbc44057d4';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardScoringContinueButtonMutationVariables = {
    id: string;
};
export type GameWizardScoringContinueButtonMutationResponse = {
    readonly continue_game: {
        readonly id: string;
    } | null;
};
export type GameWizardScoringContinueButtonMutation = {
    readonly response: GameWizardScoringContinueButtonMutationResponse;
    readonly variables: GameWizardScoringContinueButtonMutationVariables;
};



/*
mutation GameWizardScoringContinueButtonMutation(
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
    "name": "GameWizardScoringContinueButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GameWizardScoringContinueButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3b8d018baf308b205dd0b8a40997bb7d",
    "id": null,
    "metadata": {},
    "name": "GameWizardScoringContinueButtonMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardScoringContinueButtonMutation(\n  $id: ID!\n) {\n  continue_game(id: $id) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '64998a47c12ecabf47d6c1052626bc92';
export default node;

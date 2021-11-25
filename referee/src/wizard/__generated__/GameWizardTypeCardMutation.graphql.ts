/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GameWizardTypeCardMutationVariables = {
    type: string;
    name: string;
};
export type GameWizardTypeCardMutationResponse = {
    readonly create_game: {
        readonly id: string;
    } | null;
};
export type GameWizardTypeCardMutation = {
    readonly response: GameWizardTypeCardMutationResponse;
    readonly variables: GameWizardTypeCardMutationVariables;
};



/*
mutation GameWizardTypeCardMutation(
  $type: String!
  $name: String!
) {
  create_game(type: $type, name: $name) {
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "type"
},
v2 = [
  {
    "alias": null,
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
    "kind": "LinkedField",
    "name": "create_game",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardTypeCardMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "GameWizardTypeCardMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f04bef764baf91539fd2ee165209a163",
    "id": null,
    "metadata": {},
    "name": "GameWizardTypeCardMutation",
    "operationKind": "mutation",
    "text": "mutation GameWizardTypeCardMutation(\n  $type: String!\n  $name: String!\n) {\n  create_game(type: $type, name: $name) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '97ab538ce501723496a5483ffc5381be';
export default node;

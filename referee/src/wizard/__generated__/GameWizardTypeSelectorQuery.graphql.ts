/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GameWizardTypeSelectorQueryVariables = {};
export type GameWizardTypeSelectorQueryResponse = {
    readonly game_types_list: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"GameWizardTypeCard_type">;
    } | null> | null;
};
export type GameWizardTypeSelectorQuery = {
    readonly response: GameWizardTypeSelectorQueryResponse;
    readonly variables: GameWizardTypeSelectorQueryVariables;
};



/*
query GameWizardTypeSelectorQuery {
  game_types_list {
    ...GameWizardTypeCard_type
  }
}

fragment GameWizardTypeCard_type on GameType {
  type
  name
  description
  iconUrl
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardTypeSelectorQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GameType",
        "kind": "LinkedField",
        "name": "game_types_list",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "GameWizardTypeCard_type"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GameWizardTypeSelectorQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GameType",
        "kind": "LinkedField",
        "name": "game_types_list",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "iconUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1be3afd478d9d7f2c648ea525599ce87",
    "id": null,
    "metadata": {},
    "name": "GameWizardTypeSelectorQuery",
    "operationKind": "query",
    "text": "query GameWizardTypeSelectorQuery {\n  game_types_list {\n    ...GameWizardTypeCard_type\n  }\n}\n\nfragment GameWizardTypeCard_type on GameType {\n  type\n  name\n  description\n  iconUrl\n}\n"
  }
};
(node as any).hash = '8fcdd676c1c2e6476d9f5e31ee373346';
export default node;

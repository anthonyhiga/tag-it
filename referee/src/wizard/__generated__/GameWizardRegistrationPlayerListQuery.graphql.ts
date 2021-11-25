/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GameWizardRegistrationPlayerListQueryVariables = {};
export type GameWizardRegistrationPlayerListQueryResponse = {
    readonly active_players_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly ltTeamId: string | null;
            readonly ltPlayerId: string | null;
            readonly " $fragmentRefs": FragmentRefs<"GameWizardPlayerCard_card">;
        } | null> | null;
    } | null;
};
export type GameWizardRegistrationPlayerListQuery = {
    readonly response: GameWizardRegistrationPlayerListQueryResponse;
    readonly variables: GameWizardRegistrationPlayerListQueryVariables;
};



/*
query GameWizardRegistrationPlayerListQuery {
  active_players_list {
    id
    items {
      ...GameWizardPlayerCard_card
      ltTeamId
      ltPlayerId
      id
    }
  }
}

fragment GameWizardPlayerCard_card on GamePlayer {
  status
  ltTeamId
  name
  iconUrl
  avatarUrl
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltTeamId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ltPlayerId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GameWizardRegistrationPlayerListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GamePlayerList",
        "kind": "LinkedField",
        "name": "active_players_list",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GamePlayer",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "GameWizardPlayerCard_card"
              }
            ],
            "storageKey": null
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
    "name": "GameWizardRegistrationPlayerListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GamePlayerList",
        "kind": "LinkedField",
        "name": "active_players_list",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GamePlayer",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              },
              (v1/*: any*/),
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
                "name": "iconUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              (v2/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "40a82cb30617380ae988aebff5954a8d",
    "id": null,
    "metadata": {},
    "name": "GameWizardRegistrationPlayerListQuery",
    "operationKind": "query",
    "text": "query GameWizardRegistrationPlayerListQuery {\n  active_players_list {\n    id\n    items {\n      ...GameWizardPlayerCard_card\n      ltTeamId\n      ltPlayerId\n      id\n    }\n  }\n}\n\nfragment GameWizardPlayerCard_card on GamePlayer {\n  status\n  ltTeamId\n  name\n  iconUrl\n  avatarUrl\n}\n"
  }
};
})();
(node as any).hash = '41d8f23e0b007449b39694ae088b48e6';
export default node;

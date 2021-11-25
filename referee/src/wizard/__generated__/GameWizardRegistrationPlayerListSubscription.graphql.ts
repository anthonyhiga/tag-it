/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GameWizardRegistrationPlayerListSubscriptionVariables = {};
export type GameWizardRegistrationPlayerListSubscriptionResponse = {
    readonly active_players_list: {
        readonly id: string;
        readonly items: ReadonlyArray<{
            readonly ltTeamId: string | null;
            readonly ltPlayerId: string | null;
            readonly " $fragmentRefs": FragmentRefs<"GameWizardPlayerCard_card">;
        } | null> | null;
    } | null;
};
export type GameWizardRegistrationPlayerListSubscription = {
    readonly response: GameWizardRegistrationPlayerListSubscriptionResponse;
    readonly variables: GameWizardRegistrationPlayerListSubscriptionVariables;
};



/*
subscription GameWizardRegistrationPlayerListSubscription {
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
    "name": "GameWizardRegistrationPlayerListSubscription",
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
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GameWizardRegistrationPlayerListSubscription",
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
    "cacheID": "8776584ddd285aefc5abc0d67152825f",
    "id": null,
    "metadata": {},
    "name": "GameWizardRegistrationPlayerListSubscription",
    "operationKind": "subscription",
    "text": "subscription GameWizardRegistrationPlayerListSubscription {\n  active_players_list {\n    id\n    items {\n      ...GameWizardPlayerCard_card\n      ltTeamId\n      ltPlayerId\n      id\n    }\n  }\n}\n\nfragment GameWizardPlayerCard_card on GamePlayer {\n  status\n  ltTeamId\n  name\n  iconUrl\n  avatarUrl\n}\n"
  }
};
})();
(node as any).hash = 'b4f2a84b69a9e623b15f0de1c149fe19';
export default node;

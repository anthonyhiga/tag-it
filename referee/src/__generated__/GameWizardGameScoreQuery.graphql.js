/**
 * @flow
 * @relayHash 6b22574d14de67e93a14567c0317894b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PlayerStatus = "ACTIVE" | "IDLE" | "JOINING" | "%future added value";
export type GameWizardGameScoreQueryVariables = {|
  id: string
|};
export type GameWizardGameScoreQueryResponse = {|
  +game_score: ?$ReadOnlyArray<?{|
    +id: string,
    +gameId: string,
    +teamId: ?string,
    +playerId: ?string,
    +totalTagsReceived: number,
    +totalTagsGiven: number,
    +survivedTimeSec: number,
    +zoneTimeSec: number,
    +ltGameId: string,
    +ltTeamId: string,
    +ltPlayerId: string,
  |}>,
  +game_players_list: ?$ReadOnlyArray<?{|
    +id: string,
    +status: PlayerStatus,
    +ltTeamId: ?string,
    +ltPlayerId: ?string,
    +name: ?string,
    +totemId: string,
    +avatarUrl: string,
    +iconUrl: string,
  |}>,
|};
export type GameWizardGameScoreQuery = {|
  variables: GameWizardGameScoreQueryVariables,
  response: GameWizardGameScoreQueryResponse,
|};
*/


/*
query GameWizardGameScoreQuery(
  $id: ID!
) {
  game_score(id: $id) {
    id
    gameId
    teamId
    playerId
    totalTagsReceived
    totalTagsGiven
    survivedTimeSec
    zoneTimeSec
    ltGameId
    ltTeamId
    ltPlayerId
  }
  game_players_list(id: $id) {
    id
    status
    ltTeamId
    ltPlayerId
    name
    totemId
    avatarUrl
    iconUrl
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ltTeamId",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ltPlayerId",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game_score",
    "storageKey": null,
    "args": (v1/*: any*/),
    "concreteType": "GamePlayerScore",
    "plural": true,
    "selections": [
      (v2/*: any*/),
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "gameId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "teamId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "playerId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totalTagsReceived",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totalTagsGiven",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "survivedTimeSec",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "zoneTimeSec",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltGameId",
        "args": null,
        "storageKey": null
      },
      (v3/*: any*/),
      (v4/*: any*/)
    ]
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game_players_list",
    "storageKey": null,
    "args": (v1/*: any*/),
    "concreteType": "Player",
    "plural": true,
    "selections": [
      (v2/*: any*/),
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "status",
        "args": null,
        "storageKey": null
      },
      (v3/*: any*/),
      (v4/*: any*/),
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "name",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totemId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "iconUrl",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "GameWizardGameScoreQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v5/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardGameScoreQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v5/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "GameWizardGameScoreQuery",
    "id": null,
    "text": "query GameWizardGameScoreQuery(\n  $id: ID!\n) {\n  game_score(id: $id) {\n    id\n    gameId\n    teamId\n    playerId\n    totalTagsReceived\n    totalTagsGiven\n    survivedTimeSec\n    zoneTimeSec\n    ltGameId\n    ltTeamId\n    ltPlayerId\n  }\n  game_players_list(id: $id) {\n    id\n    status\n    ltTeamId\n    ltPlayerId\n    name\n    totemId\n    avatarUrl\n    iconUrl\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3fcb610d7ea26ef68b68b7ccd8f48c0b';
module.exports = node;

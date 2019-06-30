/**
 * @flow
 * @relayHash a69797a01e1f273fa7c4ff56b3e6f932
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
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
  |}>
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
    "kind": "LinkedField",
    "alias": null,
    "name": "game_score",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "GamePlayerScore",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      },
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
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltTeamId",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ltPlayerId",
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
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardGameScoreQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "GameWizardGameScoreQuery",
    "id": null,
    "text": "query GameWizardGameScoreQuery(\n  $id: ID!\n) {\n  game_score(id: $id) {\n    id\n    gameId\n    teamId\n    playerId\n    totalTagsReceived\n    totalTagsGiven\n    survivedTimeSec\n    zoneTimeSec\n    ltGameId\n    ltTeamId\n    ltPlayerId\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bdce58656439ada45d66b5e9c9b001eb';
module.exports = node;

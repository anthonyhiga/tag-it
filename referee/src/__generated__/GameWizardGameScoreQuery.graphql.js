/**
 * @flow
 * @relayHash aa727d39375b1dfddbe3ce0e9df332dc
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
  +game_settings: ?{|
    +countDownSec: ?number,
    +gameLengthInMin: ?number,
    +health: ?number,
    +reloads: ?number,
    +shields: ?number,
    +megatags: ?number,
    +totalTeams: ?number,
  |},
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
  game_settings(id: $id) {
    countDownSec
    gameLengthInMin
    health
    reloads
    shields
    megatags
    totalTeams
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
    "concreteType": "GamePlayer",
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
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game_settings",
    "storageKey": null,
    "args": (v1/*: any*/),
    "concreteType": "CurrentGameSettings",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "countDownSec",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "gameLengthInMin",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "health",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "reloads",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "shields",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "megatags",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "totalTeams",
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
    "text": "query GameWizardGameScoreQuery(\n  $id: ID!\n) {\n  game_score(id: $id) {\n    id\n    gameId\n    teamId\n    playerId\n    totalTagsReceived\n    totalTagsGiven\n    survivedTimeSec\n    zoneTimeSec\n    ltGameId\n    ltTeamId\n    ltPlayerId\n  }\n  game_players_list(id: $id) {\n    id\n    status\n    ltTeamId\n    ltPlayerId\n    name\n    totemId\n    avatarUrl\n    iconUrl\n  }\n  game_settings(id: $id) {\n    countDownSec\n    gameLengthInMin\n    health\n    reloads\n    shields\n    megatags\n    totalTeams\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9e5a5ccc708625dd40356d79ef1b9c8a';
module.exports = node;

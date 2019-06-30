/**
 * @flow
 * @relayHash d2a30d688261be338d6eb4e310ac8f75
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GameWizardGameTypesQueryVariables = {||};
export type GameWizardGameTypesQueryResponse = {|
  +game_types_list: ?$ReadOnlyArray<?{|
    +type: string,
    +name: string,
    +description: string,
    +iconUrl: string,
  |}>
|};
export type GameWizardGameTypesQuery = {|
  variables: GameWizardGameTypesQueryVariables,
  response: GameWizardGameTypesQueryResponse,
|};
*/


/*
query GameWizardGameTypesQuery {
  game_types_list {
    type
    name
    description
    iconUrl
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game_types_list",
    "storageKey": null,
    "args": null,
    "concreteType": "GameType",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "type",
        "args": null,
        "storageKey": null
      },
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
        "name": "description",
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
    "name": "GameWizardGameTypesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameWizardGameTypesQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "GameWizardGameTypesQuery",
    "id": null,
    "text": "query GameWizardGameTypesQuery {\n  game_types_list {\n    type\n    name\n    description\n    iconUrl\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e42c79161156b731fa76a9788a6690e8';
module.exports = node;

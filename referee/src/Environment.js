import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
} from "relay-runtime";

import { SubscriptionClient } from "subscriptions-transport-ws";

const HOST_NAME = "localhost:4000";
const GRAPHQL_ENDPOINT = `${HOST_NAME}/graphql`;

const fetchQuery = (operation, variables) => {
  return fetch("http://" + GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
};

const subscriptionClient = new SubscriptionClient("ws://" + GRAPHQL_ENDPOINT, {
  reconnect: true,
});

const subscribe = (request, variables) => {
  const subscribeObservable = subscriptionClient.request({
    query: request.text,
    operationName: request.name,
    variables,
  });

  // Important: Convert subscriptions-transport-ws observable type to Relay's
  return Observable.from(subscribeObservable);
};

const environment = new Environment({
  network: Network.create(fetchQuery, subscribe),
  store: new Store(new RecordSource()),
});

export default environment;

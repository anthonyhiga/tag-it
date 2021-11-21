import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { SubscriptionClient } from "subscriptions-transport-ws";

//const HOST_NAME = "192.168.10.241:4000";
const HOST_NAME = "localhost:4000";
const GRAPHQL_ENDPOINT = `${HOST_NAME}/graphql`;

const fetchQuery = (operation, variables) => {
  return fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
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

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text;
  const subscriptionClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true,
  });

  console.log(subscriptionClient);

  subscriptionClient.subscribe({ query, variables }, (error, result) => {
    observer.onNext({ data: result });
  });
};

const environment = new Environment({
  network: Network.create(fetchQuery, setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;

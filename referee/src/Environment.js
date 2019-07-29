import {
    Environment,
    Network,
    RecordSource,
    Store,
} from 'relay-runtime';

import { SubscriptionClient } from 'subscriptions-transport-ws'

const fetchQuery = (operation, variables) => {
  return fetch('http://192.168.10.169:4000/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text
  const subscriptionClient =
    new SubscriptionClient('ws://192.168.10.169:4000/graphql', {
      reconnect: true
    })

  console.log(subscriptionClient);

  subscriptionClient.subscribe({query, variables}, (error, result) => {
    observer.onNext({data: result})
  })
}


const environment = new Environment({
  network : Network.create(fetchQuery, setupSubscription), 
  store: new Store(new RecordSource()),  
});

export default environment;

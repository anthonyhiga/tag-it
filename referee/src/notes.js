

/*
requestSubscription(
  environment,
  {
    subscription: query,
    variables: {id: 17},
    onCompleted: () => {},
    onError: error => console.error(error),
  }
);
      <header className="App-header">
        <QueryRenderer
             environment={environment}
             query={query}
             variables = {{id: 17}}
             render={({error, props}) => {
                 if (error) {
                     return <div>Error! {error.toString()}</div>;
                 }
                 if (!props) {
                     return <div>Loading...</div>;
                 }
                 return <div>
                   {
                     props.game_score.map((score) => {
                       return <Score score={score}/>
                     })
                   }
                 </div>;
             }}
          />

      </header>
      */

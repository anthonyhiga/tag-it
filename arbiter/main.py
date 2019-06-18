from graphql_client import GraphQLClient
from signal import pause 

ws = GraphQLClient('ws://localhost:4000/graphql') 

def callback(_id, data):
    print(id)
    print(data)

query = """
  subscription {
    arbiter_settings_updated(id: "ID") {
      id
      mode
    }
  }
"""
sub_id = ws.subscribe(query,\
        variables={'id': 'ID'},\
        callback=callback,\
        )

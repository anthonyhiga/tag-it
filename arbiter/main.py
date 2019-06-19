from graphql_client import GraphQLClient
from signal import pause 
from command import subscribeCommands
from json import loads 

def runCommand(raw):
    print(raw)
    command = loads(raw)
    print(command)



subscribeCommands(runCommand)
pause()

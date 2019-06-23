from graphql_client import GraphQLClient
from signal import pause 
from command import subscribeCommands
from reports import subscribeReportCheckList
from game import joinedPlayer, fileBasicReport, fileTeamReport
from settings import subscribeSettings, registerArbiter, updateChannel
from json import loads 
from executor import Executor

#
# NOTE: for now we'll assume all arbiters have just 1 port, however
#     eventually this will change into channels on an arbiter
#     so an arbiter could in theory have up to 14 emitter/receivers
#
#     In practice though, I don't see more than 5 per arbiter
#     Unless, you are making a shooting gallery...
#       food for thought.
#

def onTotemUpdated(name, type, totemId):
    updateChannel(name, totemId, 'PRESENT' if totemId else 'ABSENT', type)

def onPlayerAdded(id, totemId):
    joinedPlayer(id, totemId)

def onBasicReport(report):
    zoneTime = report['zoneTimeSec'] + report['zoneTimeMin'] * 60;
    survivedTime = report['survivedTimeSec'] + report['survivedTimeMin'] * 60;

    fileBasicReport({
        'ltGameId': report['gameId'],
        'ltTeamId': report['teamId'],
        'ltPlayerId': report['playerId'],
        'zoneTimeSec': zoneTime,
        'survivedTimeSec': survivedTime,
        'tagsReceived': report['tagsReceived'],
    })

def onTeamReport(report):
    fileTeamReport({
        'ltGameId': report['gameId'],
        'ltTeamId': report['teamId'],
        'ltPlayerId': report['playerId'],
        'ltTagTeamId': report['tagTeamId'],
        'tags': report['tags'],
    })

channels = {
    'main': Executor('main', 'AREA', 3, 4, 2, {
        'onTotemUpdated': onTotemUpdated,
        'onPlayerAdded': onPlayerAdded,
        'onBasicReport': onBasicReport,
        'onTeamReport': onTeamReport,
    }) 
}

def runCommand(raw):
    command = loads(raw)
    type = command['type']
    channel = command.get('channel')

    print('RECEIVED COMMAND: ' + type)

    if type == 'START_GAME': 
        channel = channels['main']
        channel.startGame(
                command['gameId'],
                command['countDownSec'],
                command['team1Count'],
                command['team2Count'],
                command['team3Count'],
        )

    if type == 'ADD_PLAYER':
        channel = channels['main']
        channel.addPlayer(
                command['id'],
                command['gameType'],
                command['gameId'],
                command['teamId'],
                command['playerId'],
                command['gameLengthInMin'],
                command['health'],
                command['reloads'],
                command['shields'],
                command['megatags'],
                command['totalTeams'],
                command['options'],
        )

def updateList(checkList):
    print("GOT NEW REPORT LIST")
    print(checkList)
    channel = channels['main']
    channel.requestTagReports(checkList) 

registerArbiter()
subscribeSettings()
subscribeCommands(runCommand)
subscribeReportCheckList(updateList)
pause()

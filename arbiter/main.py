import os, sys, traceback
from graphql_client import GraphQLClient
from signal import pause 
from command import subscribeCommands
from reports import subscribeReportCheckList
from game import joinedPlayer, fileBasicReport, fileTeamReport
from settings import subscribeSettings, registerArbiter, updateChannel
from json import loads 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from executor import Executor

from rfid import RFID

#
# NOTE: for now we'll assume all arbiters have just 1 port, however
#     eventually this will change into channels on an arbiter
#     so an arbiter could in theory have up to 14 emitter/receivers
#
#     In practice though, I don't see more than 5 per arbiter
#     Unless, you are making a shooting gallery...
#       food for thought.
#

def onChannelUpdated(name, type, totemId, state):
    updateChannel(name, totemId, state, type)

def onPlayerAdded(id, totemId):
    joinedPlayer(id, totemId)

def onBasicReport(gameId, report):
    zoneTime = report['zoneTimeSec'] + report['zoneTimeMin'] * 60;
    survivedTime = report['survivedTimeSec'] + report['survivedTimeMin'] * 60;

    fileBasicReport({
        'gameId': gameId,
        'ltGameId': report['gameId'],
        'ltTeamId': report['teamId'],
        'ltPlayerId': report['playerId'],
        'zoneTimeSec': zoneTime,
        'survivedTimeSec': survivedTime,
        'tagsReceived': report['tagsReceived'],
        'followUpReports': report['followUpReports'],
    })

def onTeamReport(gameId, report):
    fileTeamReport({
        'gameId': gameId,
        'ltGameId': report['gameId'],
        'ltTeamId': report['teamId'],
        'ltPlayerId': report['playerId'],
        'ltTagTeamId': report['tagTeamId'],
        'tags': report['tags'],
    })

channels = {
    'main': Executor('main', 'AREA', 23, 24, {
        'onChannelUpdated': onChannelUpdated,
        'onPlayerAdded': onPlayerAdded,
        'onBasicReport': onBasicReport,
        'onTeamReport': onTeamReport,
    }),
    'holster': Executor('holster', 'HOLSTER', 3, 4, {
        'onChannelUpdated': onChannelUpdated,
        'onPlayerAdded': onPlayerAdded,
        'onBasicReport': onBasicReport,
        'onTeamReport': onTeamReport,
    }) 
}

channels['main'].createZones([
    #{
    #    'delay': 500,
    #    'type': 'SUPPLY',
    #    'team': 0,
    #},
    #{
    #    'delay': 500,
    #    'type': 'CONTESTED',
    #},
])

totems = {
    'holster': RFID(channels['holster'].setTotemId)
}

def onReconnected():
    for channel in channels:
        channels[channel].requestChannelUpdate()

def runCommandOnChannel(command, channel):
    type = command['type']

    if type == 'START_GAME': 
        print("GAME START - COUNDOWN")
        channel.startGame(
            command['gameId'],
            command['countDownSec'],
            command['team1Count'],
            command['team2Count'],
            command['team3Count'],
        )

    if type == 'ADD_PLAYER':
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

    if type == 'STOP_ADD_PLAYER':
        channel.stopAddPlayer()

    if type == 'RESET':
        print("GAME OVER - RESETTING")
        channel.reset()

def runCommand(raw):
    command = loads(raw)
    type = command['type']

    channelName = command.get('channel')
    if channelName == None:
        print('RECEIVED GLOBAL COMMAND: ' + str(type))
        for channel in channels:
            runCommandOnChannel(command, channels[channel])
    else:
        print('RECEIVED COMMAND: ' + str(type) + ' channel: ' + str(channelName))
        channel = channels[channelName]
        runCommandOnChannel(command, channel)

def updateList(checkList):
    for channel in channels:
      channels[channel].requestTagReports(checkList) 

registerArbiter()
subscribeSettings()
subscribeCommands(runCommand, onReconnected)
subscribeReportCheckList(updateList)
pause()

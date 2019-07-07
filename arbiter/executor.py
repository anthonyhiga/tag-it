import sys, traceback, os
from signal import pause 
from time import sleep
from threading import Timer, Thread 
from gpiozero import Button
from enum import Enum

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from tagit.bus import MessageInputStream, MessageOutputStream
from tagit.packet_send import genAnnounceGame, genJoinConfirmed,\
        genChannelFailure, genCountdown, genRequestTagReport 
from tagit.packet_receive import decodeMessage, MessageType 

class AddPlayerState(Enum):
    ADVERTISE = 1
    ASSIGNED = 2
    CONFIRMED = 3
    FAILED = 4
    COMPLETE = 5


###############################################################################
#
# NOTE: there is a really bad psudo state machine like pattern... this needs to be
#       redone with something much cleaner.
#
###############################################################################
class Executor(object):
    def __init__(self, name, type, inputPort, outputPort, handlers):
        print("CHANNEL SETUP INPUT: " + str(inputPort) + " OUTPUT: " + str(outputPort))
        self.name = name
        self.type = type
        self.handlers = handlers
        self.totemId = None
        self.reportCheckList = []

        self.outputStream = MessageOutputStream(outputPort)
        self.inputStream = MessageInputStream(inputPort, {
            'onPacket': self.onMessage,
            'onStandardBeacon': self.onStandardBeacon,
            'onAdvancedBeacon': self.onAdvancedBeacon,
            'onZoneBeacon': self.onZoneBeacon,
            'onTag': self.onTag,
        })
        self.inputStream.start()

        self.addPlayerState = AddPlayerState.COMPLETE
        self.addPlayerRequest = False
        self.addPlayerCount = 0

        thread = Thread(target=self.reportMonitor)
        thread.start()

        self.reportThread = thread

    def requestChannelUpdate(self):
        self.onChannelUpdate()

    def onChannelUpdate(self):
        state = 'ASSIGNING'
        if self.addPlayerState == AddPlayerState.COMPLETE:
            state = 'AVAILABLE'
            if self.addPlayerRequest:
                state = 'REQUESTING'

        self.handlers['onChannelUpdated'](self.name, self.type, self.totemId, state) 

    def stopAddPlayer(self):
        self.addPlayerState = AddPlayerState.COMPLETE
        self.addPlayerRequest = False 
        self.addPlayerDetail = None
        self.addPlayerMessage = None
        self.addPlayerFailedMessage = None
        self.addPlayerFailedCount = 6 
        self.addPlayerCount = self.addPlayerCount + 1
        self.onChannelUpdate()

    def requestPlayer(self):
        self.addPlayerRequest = True
        self.onChannelUpdate()

    def setTotemId(self, totemId):
        print("SETTING TOTEM TO: " + str(totemId))
        self.totemId = totemId
        self.onChannelUpdate()

    def onStandardBeacon(self, team, tag): 
        # Ignore for now
        None

    def onAdvancedBeacon(self, team, player, tag, shield, life): 
        # Ignore for now
        None

    def onZoneBeacon(self, team, tag, flex): 
        # Ignore for now
        None

    def onTag(self, team, player, strength): 
        # Ignore for now
        None

    def onMessage(self, raw):
        message = decodeMessage(raw)
        if (message != None):
            type = message['type']
            print("GOT MESSAGE: " + type.name)
            if (type == MessageType.REQUEST_TO_JOIN and self.addPlayerState == AddPlayerState.ADVERTISE):
                self.addPlayerState = AddPlayerState.ASSIGNED
                self.addPlayerDetail['taggerId'] = message['taggerId']
                print("PLAYER JOIN REQUEST RECEIVED FROM TAGGER: " + str(message['taggerId']))
                self.addPlayerFailedCount = 6 
                self.addPlayerFailedMessage = genChannelFailure(self.addPlayerDetail['gameId'],
                        self.addPlayerDetail['taggerId'])

                confirm = genJoinConfirmed(self.addPlayerDetail['gameId'],
                        self.addPlayerDetail['taggerId'],
                        self.addPlayerDetail['teamId'],
                        self.addPlayerDetail['playerId'])
                self.outputStream.send(confirm)
                sleep(0.1)
                self.outputStream.send(confirm)
                sleep(0.1)
                self.outputStream.send(confirm)
                self.onChannelUpdate()

            if (type == MessageType.CHANNEL_RELEASE and self.addPlayerState == AddPlayerState.ASSIGNED):
                print("PLAYER JOIN CONFIRMED FROM TAGGER: " + str(message['taggerId']))
                self.handlers['onPlayerAdded'](self.addPlayerDetail['id'], self.addPlayerDetail['totemId'])
                self.stopAddPlayer()

            if (type == MessageType.BASIC_DEBRIEF_DATA):
                print("BASIC REPORT RECEIVED: " + str(message['teamId']) + ":" + str(message['playerId']))
                self.handlers['onBasicReport'](self.currentGameId, message);

            if (type == MessageType.GROUP_1_DEBRIEF_DATA or \
                    type == MessageType.GROUP_2_DEBRIEF_DATA or \
                    type == MessageType.GROUP_3_DEBRIEF_DATA):
                print("TEAM REPORT RECEIVED: " + str(message['teamId']) + ":" + str(message['playerId']))
                self.handlers['onTeamReport'](self.currentGameId, message)

    def requestTagReports(self, checkList):
      self.reportCheckList = checkList;

    def reportMonitor(self):
      while(True):
        try:
          def getBaseKey(item):
            return str(item['ltGameId']) + \
              ':' + str(item['ltTeamId']) + \
              ':' + str(item['ltPlayerId'])

          def getTeamKey(item, ltTagTeamId):
            return str(item['ltGameId']) + ':' + \
              str(item['ltTeamId']) + ':' + \
              str(item['ltPlayerId']) + ':' + \
              str(ltTagTeamId)

          # instance list
          reportCheckList = self.reportCheckList
          queryList = []
          baseQueryList = []
          teamQueryList = []
          for item in reportCheckList:
            if item['status'] == 'COMPLETE':
              continue

            self.currentGameId = item['gameId']
            key = getBaseKey(item)
            if not key in queryList:
              queryList.append(item)

            if (item['ltTagTeamId'] == None):
              baseQueryList.append(key)
              continue

            key = getTeamKey(item, item['ltTagTeamId'])
            if not key in teamQueryList:
              teamQueryList.append(key)

          for player in queryList:
            summary = 0
            team1Report = 0
            team2Report = 0
            team3Report = 0

            # If we don't have the summary, we want to ask for everything
            if getBaseKey(player) in baseQueryList:
              summary = 1
              team1Report = 1
              team2Report = 1
              team3Report = 1
            else:
              team1Report = 1 if getTeamKey(player, 1) in teamQueryList else 0
              team2Report = 1 if getTeamKey(player, 2) in teamQueryList else 0
              team3Report = 1 if getTeamKey(player, 3) in teamQueryList else 0


            print("REPORT REQUEST FROM TEAM: " + str(player['ltTeamId']) +
                " PLAYER: " + str(player['ltPlayerId']) + 
                " TEAM 1: " + str(team1Report) +
                " TEAM 2: " + str(team2Report) +
                " TEAM 3: " + str(team3Report) +
                " SUMMARY: " + str(summary))

            for i in range(0, 3):
              message = genRequestTagReport(
                    int(player['ltGameId']),
                    int(player['ltTeamId']),
                    int(player['ltPlayerId']),
                    team1Report,
                    team2Report,
                    team3Report,
                    summary)
              self.outputStream.send(message)
              sleep(1.5) # we wait 3 seconds for a response

        except: 
          print("Unexpected error:", sys.exc_info()[0])
          traceback.print_tb(sys.exc_info()[2])

        sleep(2)

    def startGame(self, gameId, countDownSec, team1Count, team2Count, team3Count):
        print("BEGINNING COUNTDOWN")

        # Start Countdown
        for count in range(countDownSec, -1, -1):
            sleep(1)
            print("TIME TO START: " + str(count))
            message = genCountdown(gameId, count, team1Count, team2Count, team3Count) 
            self.outputStream.send(message)

    def addPlayer(self, id, gameType, gameId, teamId, playerId, gameLengthInMin, health,
            reloads, shields, megatags, totalTeams, options = []):
        # TODO: setup some kind of timeout on adding a player
        print("ADDING PLAYER FOR GAME: " + str(gameId) + " ID: " + str(id))

        self.addPlayerDetail = {
                'id': id,
                'totemId': self.totemId,
                'gameId': gameId,
                'playerId': playerId,
                'teamId': teamId} 
        self.addPlayerMessage = genAnnounceGame(gameType, gameId, gameLengthInMin,
                health, reloads, shields, megatags, totalTeams, options)
        self.addPlayerState = AddPlayerState.ADVERTISE
        self.onChannelUpdate()

        self.addPlayerCount = self.addPlayerCount + 1
        thread = Thread(target=self.playerLoop)
        thread.start()

    def playerLoop(self):
        print("SEARCHING FOR NEW PLAYER")
        instanceId = self.addPlayerCount
        while(self.addPlayerState != AddPlayerState.COMPLETE and self.addPlayerCount == instanceId):
            if (self.addPlayerState == AddPlayerState.ADVERTISE):
                self.outputStream.send(self.addPlayerMessage)
                sleep(1)
            if (self.addPlayerState == AddPlayerState.ASSIGNED):
                # wait 4 seconds for confirmation if none found, we
                # consider it failed and send out a failure 6 times
                sleep(2)
                if (self.addPlayerState == AddPlayerState.ASSIGNED):
                    print("CONNECTION FAILURE")
                    self.addPlayerState = AddPlayerState.FAILED
                    self.onChannelUpdate()

            if (self.addPlayerState == AddPlayerState.FAILED):
                self.outputStream.send(self.addPlayerFailedMessage)
                self.addPlayerFailedCount = self.addPlayerFailedCount - 1
                sleep(0.5)

                if (self.addPlayerFailedCount <= 0):
                    print("SEARCH RESTARTED FOR NEW PLAYER")
                    self.addPlayerState = AddPlayerState.ADVERTISE
                    self.onChannelUpdate()
            else:
                sleep(0.5)
        print("ADD PLAYER COMPLETE")


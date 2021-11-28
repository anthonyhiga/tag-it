import sys, traceback, os
from signal import pause 
from time import sleep, monotonic
from threading import Timer, Thread, Lock
from gpiozero import Button
from enum import Enum

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from tagit.bus import MessageInputStream, MessageOutputStream
from tagit.packet_send import genZoneBeacon, genTag, genAnnounceGame, genJoinConfirmed,\
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
    def __init__(self, name, type, inputPort, outputPort, handlers, options):
        self.name = name
        self.type = type
        self.handlers = handlers
        self.totemId = None
        self.reportCheckList = []
        self.gameActive = False
        self.options = options;

        self.log("CHANNEL - SETUP INPUT: " + str(inputPort) + " OUTPUT: " + str(outputPort))

        self.outputStream = MessageOutputStream(outputPort, self.isBusy)
        self.inputStream = MessageInputStream(inputPort, {
            'onPacket': self.onMessage,
            'onStandardBeacon': self.onStandardBeacon,
            'onAdvancedBeacon': self.onAdvancedBeacon,
            'onZoneBeacon': self.onZoneBeacon,
            'onTag': self.onTag,
        })
        self.inputStream.start()

        self.setPlayerState(AddPlayerState.COMPLETE)
        self.addPlayerRequest = False
        self.addPlayerThread = None

        thread = Thread(target=self.reportMonitor)
        thread.start()

        self.reportThread = thread

    def isBusy(self, busy):
        self.inputStream.setSilent(busy)

    def log(self, message):
        print(self.name + ':' + str(message));

    def requestChannelUpdate(self):
        self.onChannelUpdate()

    def onChannelUpdate(self):
        state = 'ASSIGNING'
        if self.addPlayerState == AddPlayerState.COMPLETE:
            state = 'AVAILABLE'
            if self.addPlayerRequest:
                state = 'REQUESTING'

        self.handlers['onChannelUpdated'](self.name, self.type, self.totemId, state) 

    def reset(self):
        self.gameActive = False
        self.stopAddPlayer()

    def stopAddPlayer(self):
        self.setPlayerState(AddPlayerState.COMPLETE)
        self.addPlayerRequest = False 
        self.addPlayerDetail = None
        self.addPlayerMessage = None
        self.addPlayerFailedMessage = None
        self.addPlayerFailedCount = 6 
        self.onChannelUpdate()

    def requestPlayer(self):
        self.addPlayerRequest = True
        self.onChannelUpdate()

    def setTotemId(self, totemId):
        self.log("TOTEM - SETTING TOTEM TO: " + str(totemId))
        self.totemId = totemId
        self.requestPlayer()

    def onStandardBeacon(self, team, tag): 
        # self.log("Beacon - Standard Received")
        # Ignore for now
        None

    def onAdvancedBeacon(self, team, player, tag, shield, life): 
        # self.log("Beacon - Advanced Received")
        # Ignore for now
        None

    def onZoneBeacon(self, team, tag, flex): 
        # self.log("Beacon - Zone Received")
        # Ignore for now
        None

    def onTag(self, team, player, strength): 
        # self.log("Tag - Received")
        # Ignore for now
        None

    def onMessage(self, raw):
        message = decodeMessage(raw)
        if (message != None):
            type = message['type']
            self.log("GOT MESSAGE: " + type.name)
            if (type == MessageType.REQUEST_TO_JOIN and self.addPlayerState == AddPlayerState.ADVERTISE):
                self.log("PLAYER - JOIN REQUEST RECEIVED FROM TAGGER: " + str(message['taggerId']))
                self.setPlayerState(AddPlayerState.ASSIGNED)
                self.addPlayerDetail['taggerId'] = message['taggerId']
                self.addPlayerFailedCount = 6 
                self.addPlayerFailedMessage = genChannelFailure(self.addPlayerDetail['gameId'],
                        self.addPlayerDetail['taggerId'])

                confirm = genJoinConfirmed(self.addPlayerDetail['gameId'],
                        self.addPlayerDetail['taggerId'],
                        self.addPlayerDetail['teamId'],
                        self.addPlayerDetail['playerId'])

                self.log("PLAYER - SENDING [1] CONFIRM TAGGER: " + str(message['taggerId']))
                self.outputStream.send(confirm)
                sleep(0.5)

                self.log("PLAYER - JOIN REQUEST PROCESSED: " + str(message['taggerId']) + " STATE: " + str(self.addPlayerState)) 
                self.onChannelUpdate()

            if (type == MessageType.CHANNEL_RELEASE):
                self.log("PLAYER - JOIN CONFIRMED FROM TAGGER: " + str(message['taggerId']))
                self.handlers['onPlayerAdded'](self.addPlayerDetail['id'], self.addPlayerDetail['totemId'])
                self.stopAddPlayer()

            if (type == MessageType.BASIC_DEBRIEF_DATA):
                self.log("SCORE - BASIC REPORT RECEIVED: " + str(message['teamId']) + ":" + str(message['playerId']))
                self.handlers['onBasicReport'](self.currentGameId, message);

            if (type == MessageType.GROUP_1_DEBRIEF_DATA or \
                    type == MessageType.GROUP_2_DEBRIEF_DATA or \
                    type == MessageType.GROUP_3_DEBRIEF_DATA):
                self.log("SCORE - TEAM REPORT RECEIVED: " + str(message['teamId']) + ":" + str(message['playerId']))
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

          if len(queryList) == 0:
              sleep(5)
              continue

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


            self.log("SCORE - REPORT REQUEST FROM TEAM: " + str(player['ltTeamId']) +
                " PLAYER: " + str(player['ltPlayerId']) + 
                " TEAM 1: " + str(team1Report) +
                " TEAM 2: " + str(team2Report) +
                " TEAM 3: " + str(team3Report) +
                " SUMMARY: " + str(summary))

            message = genRequestTagReport(
                    int(player['ltGameId']),
                    int(player['ltTeamId']),
                    int(player['ltPlayerId']),
                    team1Report,
                    team2Report,
                    team3Report,
                    summary)
            self.outputStream.send(message)
            sleep(1.5) # we wait 1.5 seconds for a response

        except: 
          self.log("ERROR - Unexpected error:", sys.exc_info()[0])
          traceback.print_tb(sys.exc_info()[2])

    def startGame(self, gameId, countDownSec, team1Count, team2Count, team3Count):
        self.log("START - BEGINNING COUNTDOWN")
        self.gameActive = True

        if not self.options['AllowGameStart']:
            return

        self.log("BROADCASTING START")
        thread = Thread(target=self.countdownThread, 
                args=(gameId, countDownSec, team1Count, team2Count, team3Count))
        thread.start()

    def setPlayerState(self, state):
        self.log("PLAYER - STATE: " + str(state));
        self.addPlayerState = state 


    def addPlayer(self, id, gameType, gameId, teamId, playerId, gameLengthInMin, health,
            reloads, shields, megatags, totalTeams, options = []):
        # TODO: setup some kind of timeout on adding a player
        self.log("PLAYER - ADDING PLAYER FOR GAME: " + str(gameId) + " ID: " + str(id))
        self.log(options)

        self.addPlayerDetail = {
                'id': id,
                'totemId': self.totemId,
                'gameId': gameId,
                'playerId': playerId,
                'teamId': teamId} 
        self.addPlayerMessage = genAnnounceGame(gameType, gameId, gameLengthInMin,
                health, reloads, shields, megatags, totalTeams, options)
        self.setPlayerState(AddPlayerState.ADVERTISE)
        self.onChannelUpdate()

        thread = Thread(target=self.playerLoop)
        thread.start()

    def createZones(self, zones): 
        self.zones = zones
        thread = Thread(target=self.zoneLoop)
        thread.start()
        
    def countdownThread(self, gameId, countDownSec, team1Count, team2Count, team3Count):
        # Start Countdown
        for count in range(countDownSec, -1, -1):
            sleep(1)
            self.log("START - TIME TO START: " + str(count))
            message = genCountdown(gameId, count, team1Count, team2Count, team3Count) 
            self.outputStream.send(message)

    def zoneLoop(self):
        print("ZONE - CREATING ZONES")
        print(self.zones)
        lastGameActive = None
        time = 0
        while(True and len(self.zones) > 0):
          sleep(0.01);
          time = time + 10

          if lastGameActive != self.gameActive:
              lastGameActive = self.gameActive
              if self.gameActive:
                  print("ZONE - ACTIVATED")
              else:
                  print("ZONE - WAITING ON NEW GAME")

          if not self.gameActive:
              continue

          for zone in self.zones:
              type = zone['type']
              if (time % zone['delay'] != 0):
                  continue

              if type == "HOSTILE":
                player = 4
                if zone['team'] == 1:
                    player = 5
                if zone['team'] == 2:
                    player = 6 
                if zone['team'] == 3:
                    player = 7

                tag = genTag(0, player, zone['strength'])
                self.outputStream.send(tag)
              elif type == "SUPPLY":
                beacon = genZoneBeacon(zone['team'], "SUPPLY")
                print(beacon)
                self.outputStream.send(beacon)
              elif type == "CONTESTED":
                beacon = genZoneBeacon(0, "CONTESTED")
                self.outputStream.send(beacon)

    def playerLoop(self):
        self.log("PLAYER - SEARCHING FOR NEW PLAYER")
        id = monotonic()
        self.addPlayerID = id 
        while(self.addPlayerState != AddPlayerState.COMPLETE):
            if (self.addPlayerID != id):
                self.log('PLAYER - SEARCH REPLACED')
                break

            if (self.addPlayerState == AddPlayerState.ADVERTISE):
                self.log('PLAYER - ADVERTISE GAME')
                self.outputStream.send(self.addPlayerMessage)
                sleep(1.5)

            if (self.addPlayerState == AddPlayerState.ASSIGNED):
                # wait 2 seconds for confirmation if none found, we
                # consider it failed and send out a failure 6 times
                sleep(2)
                if (self.addPlayerState == AddPlayerState.ASSIGNED and self.addPlayerID == id):
                    self.setPlayerState(AddPlayerState.FAILED)
                    self.onChannelUpdate()

            if (self.addPlayerState == AddPlayerState.FAILED):
                self.log("PLAYER - ASSIGNMENT FAILURE: " + str(self.addPlayerFailedCount))
                self.outputStream.send(self.addPlayerFailedMessage)
                self.addPlayerFailedCount = self.addPlayerFailedCount - 1
                sleep(0.5)

                if (self.addPlayerFailedCount <= 0 and self.addPlayerID == id):
                    self.log("PLAYER - SEARCH RESTARTED FOR NEW PLAYER")
                    self.setPlayerState(AddPlayerState.ADVERTISE)
                    self.onChannelUpdate()
            else:
                sleep(0.5)

        self.log("PLAYER - ADD PLAYER COMPLETE")
        self.totemId = None 


from signal import pause 
from time import sleep
from threading import Timer, Thread 
from gpiozero import Button
from enum import Enum

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from tagit.bus import MessageInputStream, MessageOutputStream
from tagit.packet_send import genAnnounceGame, genJoinConfirmed, genChannelFailure 
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
    def __init__(self, inputPort, outputPort):
        self.outputStream = MessageOutputStream(outputPort)
        self.inputStream = MessageInputStream(inputPort, {
            'onPacket': self.onMessage
        })
        self.inputStream.start()

        self.addPlayerState = AddPlayerState.COMPLETE

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

            if (type == MessageType.CHANNEL_RELEASE and self.addPlayerState == AddPlayerState.ASSIGNED):
                print("PLAYER JOIN CONFIRMED FROM TAGGER: " + str(message['taggerId']))
                self.addPlayerState = AddPlayerState.COMPLETE
                self.addPlayerDetail = None
                self.addPlayerMessage = None
                self.addPlayerFailedMessage = None
                self.addPlayerFailedCount = 6 

    def addPlayer(self, gameType, gameId, teamId, playerId, gameLengthInMin, health,
            reloads, shields, megatags, totalTeams, options = []):

        self.addPlayerDetail = {
                'gameId': gameId,
                'playerId': playerId,
                'teamId': teamId} 
        self.addPlayerMessage = genAnnounceGame(gameType, gameId, gameLengthInMin,
                health, reloads, shields, megatags, totalTeams, options)
        self.addPlayerState = AddPlayerState.ADVERTISE

        thread = Thread(target=self.playerLoop)
        thread.start()

    def playerLoop(self):
        print("SEARCHING FOR NEW PLAYER")
        while(self.addPlayerState!= AddPlayerState.COMPLETE):
            if (self.addPlayerState == AddPlayerState.ADVERTISE):
                self.outputStream.send(self.addPlayerMessage)
                sleep(1.5)
            if (self.addPlayerState == AddPlayerState.ASSIGNED):
                # wait 4 seconds for confirmation if none found, we
                # consider it failed and sned out a failure 6 times
                sleep(1)
                if (self.addPlayerState == AddPlayerState.ASSIGNED):
                    print("CONNECTION FAILURE")
                    self.addPlayerState = AddPlayerState.FAILED

            if (self.addPlayerState == AddPlayerState.FAILED):
                self.outputStream.send(self.addPlayerFailedMessage)
                self.addPlayerFailedCount = self.addPlayerFailedCount - 1
                sleep(0.5)

                if (self.addPlayerFailedCount <= 0):
                    print("SEARCH RESTARTED FOR NEW PLAYER")
                    self.addPlayerState = AddPlayerState.ADVERTISE
            else:
                sleep(0.5)
        print("ADD PLAYER COMPLETE")


import os, sys, traceback
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from tagit.bus import MessageInputStream
from signal import pause 

def onPacket(message):
    print("GOT PACKET: " + str(message[0]))

def onStandardBeacon(team, tag):
    print("GOT STD BEACON TEAM: " + str(team) + " TAG: " + str(tag))

def onAdvancedBeacon(team, player, tag, shield, life):
    print("GOT ADV BEACON TEAM: " + str(team) + " PLAYER: " + 
             str(player) + " TAG: " + str(tag) + " SHIELD: " + str(shield) + " LIFE: " + str(life))

def onZoneBeacon(team, tag, flex):
    print("GOT ZONE BEACON TEAM: " + str(team) + " TAG: " + str(tag))

def onTag(team, player, strength):
    print("GOT TAG TEAM: " + str(team) + " PLAYER: " + str(player))

inputStream = MessageInputStream(23, {
    'onPacket': onPacket,
    'onStandardBeacon': onStandardBeacon,
    'onAdvancedBeacon': onAdvancedBeacon,
    'onZoneBeacon': onZoneBeacon,
    'onTag': onTag,
})
inputStream.start()

pause()



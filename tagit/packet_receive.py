from bus import MessageBuilder 
from enum import Enum


class MessageType(Enum):
    REQUEST_JOIN_GAME = 0x10
    CHANNEL_RELEASE = 0x11
    BASIC_DEBRIEF_DATA = 0x40
    GROUP_1_DEBRIEF_DATA = 0x41
    GROUP_2_DEBRIEF_DATA = 0x42
    GROUP_3_DEBRIEF_DATA = 0x43
    HEAD_TO_HEAD_SCORE_DATA = 0x48


########################################################################
#
#  Decode incoming message 
#
########################################################################

def BCDtoD(byte):
    return ((byte >> 4) * 10) + (byte & 0xF)

def decodeTagReport(message):
    index = 4
    validPlayers = message[3]
    hits = {}
    for i in range(0, 8):
        if (validPlayers & (1 << i) > 0):
            hits[i] = message[index] 
            index = index + 1
        else:
            hits[i] = 0

    team1 = {}
    team2 = {}
    team3 = {}
    if (message[0] == MessateType.GROUP_1_DEBRIEF_DATA): 
        team1 = hits
    elif (message[0] == MessateType.GROUP_2_DEBRIEF_DATA): 
        team2 = hits
    elif (message[0] == MessateType.GROUP_3_DEBRIEF_DATA): 
        team3 = hits

    return {\
        type: message[0],\
        gameId: message[1],\
        teamId: message[2] >> 4,\
        playerId: message[2] & 0xF,\
        hits: {\
            team1: team1,\
            team2: team2,\
            team3: team3,\
        },\
    }

def decodeMessage(message):
    type = message[0]
    if (type == MessateType.REQUEST_JOIN_GAME):
        return {\
          type: message[0],\
          gameId: message[1],\
          taggerId: message[2],\
          preferredTeam: message[3] & 0x3,\
        }
    elif (type == MessateType.CHANNEL_RELEASE):
        return {\
          type: message[0],\
          gameId: message[1],\
          taggerId: message[2],\
        }
    elif (type == MessateType.BASIC_DEBRIEF_DATA):
        followUpReports = []
        if (message[8] & 0x2):
            followUpReports.push('team1')
        if (message[8] & 0x4):
            followUpReports.push('team2')
        if (message[8] & 0x8):
            followUpReports.push('team3')

        return {\
          type: message[0],\
          gameId: message[1],\
          teamId: message[2] >> 4,\
          playerId: message[2] & 0xF,\
          tagsReceived: BCDtoD(message[3]),\
          survivedTimeMin: BCDtoD(message[4]),\
          survivedTimeSec: BCDtoD(message[5]),\
          zoneTimeMin: BCDtoD(message[6]),\
          zoneTimeSec: BCDtoD(message[7]),\
          followUpReports: followUpReports\
        }
    elif (type == MessateType.GROUP_1_DEBRIEF_DATA):
        return decodeTagReport(message)
    elif (type == MessateType.GROUP_2_DEBRIEF_DATA):
        return decodeTagReport(message)
    elif (type == MessateType.GROUP_3_DEBRIEF_DATA):
        return decodeTagReport(message)
    elif (type == MessateType.HEAD_TO_HEAD_SCORE_DATA):
        None
    else:
        print("RECEIVED UNKNOWN MESSAGE: " + str(type));
        return None 



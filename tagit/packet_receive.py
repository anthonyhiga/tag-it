from .bus import MessageBuilder 
from enum import Enum


class MessageType(Enum):
    GAME_START = 0x00
    JOIN_CONFIRMED = 0x01
    HOSTING_CUSTOM = 0x02
    HOSTING_2_TEAMS = 0x03
    HOSTING_3_TEAMS = 0x04
    HOSTING_HIDE_AND_SEEK = 0x05
    HOSTING_HUNTER_HUNTED = 0x06
    HOSTING_2_KINGS = 0x07
    HOSTING_3_KINGS = 0x08
    HOSTING_OWN_THE_ZONE = 0x09
    HOSTING_2_TEAM_OWN_THE_ZONE = 0x0A
    HOSTING_3_TEAM_OWN_THE_ZONE = 0x0B
    HOSTING_HOOK_GAME = 0x0C
    CHANNEL_FAILURE = 0x0F
    REQUEST_TO_JOIN = 0x10
    CHANNEL_RELEASE = 0x11
    MEDIC_REQUEST = 0x20
    MEDIC_ASSIST = 0x21
    MEDIC_RELEASE = 0x22
    DEBRIEF_DATA_NEEDED = 0x31
    RANKINGS = 0x32
    NAME_DATA = 0x33
    BASIC_DEBRIEF_DATA = 0x40
    GROUP_1_DEBRIEF_DATA = 0x41
    GROUP_2_DEBRIEF_DATA = 0x42
    GROUP_3_DEBRIEF_DATA = 0x43
    HEAD_TO_HEAD_SCORE_DATA = 0x48
    BASIC_DE_CLONING_DATA = 0x50
    GROUP_1_DE_CLONING_DATA = 0x51
    GROUP_2_DE_CLONING_DATA = 0x52
    GROUP_3_DE_CLONING_DATA = 0x53
    DE_CLONING_REQUEST = 0x54
    TEXT_MESSAGE = 0x80
    LTAR_GAME = 0x81
    LTAR_RTJ = 0x82
    LTAR_PLAYER = 0x83
    LTAR_ACCEPT = 0x84
    LTAR_NAME = 0x85
    LTAR_WHODAT = 0x86
    LTAR_RELEASE = 0x87
    LTAR_START_COUNTDOWN = 0x88
    LTAR_ABORT = 0x8F
    LTAR_SPECIAL_ATTACK = 0x90


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
    if (message[0] == MessageType.GROUP_1_DEBRIEF_DATA.value): 
        team1 = hits
    elif (message[0] == MessageType.GROUP_2_DEBRIEF_DATA.value): 
        team2 = hits
    elif (message[0] == MessageType.GROUP_3_DEBRIEF_DATA.value): 
        team3 = hits

    return {
        'type': MessageType(message[0]),
        'gameId': message[1],
        'teamId': message[2] >> 4,
        'playerId': message[2] & 0xF,
        'hits': {
            'team1': team1,
            'team2': team2,
            'team3': team3,
        },
    }

def decodeMessage(message):
    type = message[0]
    if (type == MessageType.REQUEST_TO_JOIN.value):
        return {
          'type': MessageType(message[0]),
          'gameId': message[1],
          'taggerId': message[2],
          'preferredTeam': message[3] & 0x3,
        }
    elif (type == MessageType.CHANNEL_RELEASE.value):
        return {
          'type': MessageType(message[0]),
          'gameId': message[1],
          'taggerId': message[2],
        }
    elif (type == MessageType.BASIC_DEBRIEF_DATA.value):
        followUpReports = []
        if (message[8] & 0x2):
            followUpReports.push('team1')
        if (message[8] & 0x4):
            followUpReports.push('team2')
        if (message[8] & 0x8):
            followUpReports.push('team3')

        return {
          'type': MessageType(message[0]),
          'gameId': message[1],
          'teamId': message[2] >> 4,
          'playerId': message[2] & 0xF,
          'tagsReceived': BCDtoD(message[3]),
          'survivedTimeMin': BCDtoD(message[4]),
          'survivedTimeSec': BCDtoD(message[5]),
          'zoneTimeMin': BCDtoD(message[6]),
          'zoneTimeSec': BCDtoD(message[7]),
          'followUpReports': followUpReports
        }
    elif (type == MessageType.GROUP_1_DEBRIEF_DATA.value):
        return decodeTagReport(message)
    elif (type == MessageType.GROUP_2_DEBRIEF_DATA.value):
        return decodeTagReport(message)
    elif (type == MessageType.GROUP_3_DEBRIEF_DATA.value):
        return decodeTagReport(message)
    elif (type == MessageType.HEAD_TO_HEAD_SCORE_DATA.value):
        None
    else:
        try:
            messageType = MessageType(message[0])
            print("RECEIVED UNHANDLED MESSAGE: " + messageType.name);
        except:
            print("RECEIVED UNKNOWN MESSAGE: " + str(message[0]));

        return None 



from .bus import MessageBuilder 
import sys 
import traceback

########################################################################
#
#  Generate Countdown Message
#
########################################################################
def genCountdown(gameId, count, team1Count, team2Count, team3Count):
    return MessageBuilder().packet(0x0)\
           .gameId(gameId)\
           .data()\
           .numberDbit(count)\
           .data()\
           .number8bit(team1Count)\
           .data()\
           .number8bit(team2Count)\
           .data()\
           .number8bit(team3Count)\
           .checksum()\
           .toMessage()

########################################################################
#
#  Generate Game Announcement Message
#
########################################################################
def genAnnounceGame(gameType, gameId, gameLengthInMin, health, reloads, shields, megatags, totalTeams, options = []):
    type = 0x2
    if (gameType == "CUSTOM"):
        type = 0x2
    elif (gameType == "2-TEAMS"):
        type = 0x3
    elif (gameType == "3-TEAMS"):
        type = 0x4
    elif (gameType == "HIDE-AND-SEEK"):
        type = 0x5
    elif (gameType == "HUNTER-HUNTED"):
        type = 0x6
    elif (gameType == "2-KINGS"):
        type = 0x7
    elif (gameType == "3-KINGS"):
        type = 0x8
    elif (gameType == "OWN-THE-ZONE"):
        type = 0x9
    elif (gameType == "2-TEAM-OWN-THE-ZONE"):
        type = 0xA
    elif (gameType == "3-TEAM-OWN-THE-ZONE"):
        type = 0xB
    elif (gameType == "HOOK-GAME"):
        type = 0xC

    flag1 = 0
    flag2 = totalTeams
    if 'neutralize_10_tags' in options:
        flag1 = flag1 | (1<<7)
        flag2 = flag2 | (1<<5) 
    elif 'neutralize_1_tag' in options:
        flag2 = flag2 | (1<<5) 
    elif 'limited_reloads' in options:
        flag1 = flag1 | (1<<6) 
    elif 'limited_mega_tags' in options:
        flag1 = flag1 | (1<<5) 
    elif 'team_tags' in options:
        flag1 = flag1 | (1<<4) 
    elif 'medic_mode' in options:
        flag1 = flag1 | (1<<3) 
    elif 'show_tags' in options:
        flag1 = flag1 | (1<<2) 
    elif 'team_1_hunts_first' in options:
        flag1 = flag1 | (1<<1) 
    elif 'team_2_hunts_first' in options:
        flag1 = flag1 | (1<<1) 
        flag1 = flag1 | (1<<0) 
    elif 'contested_zones' in options:
        flag2 = flag2 | (1<<7) 
    elif 'team_zones' in options:
        flag2 = flag2 | (1<<6) 
    elif 'unneutralize_supply_zones' in options:
        # note this might be to convert a gun into a zone
        flag2 = flag2 | (1<<4) 
    elif 'refill_tags_supply_zones' in options:
        # note this might be to convert a gun into a zone
        flag2 = flag2 | (1<<3) 
    elif 'hostile_zones' in options:
        # note this might be to convert a gun into a zone
        flag2 = flag2 | (1<<2) 

    return MessageBuilder().packet(type)\
            .gameId(gameId)\
            .data()\
            .numberDbit(gameLengthInMin)\
            .data()\
            .numberDbit(health)\
            .data()\
            .numberDbit(reloads)\
            .data()\
            .numberDbit(shields)\
            .data()\
            .numberDbit(megatags)\
            .data()\
            .number8bit(flag1)\
            .data()\
            .number8bit(flag2)\
            .checksum()\
            .toMessage()


########################################################################
#
#  Generate Join Confirmation Message
#     In rsponse to Join Request from Tagger
#
########################################################################
def genJoinConfirmed(gameId, taggerId, team, player):
    return MessageBuilder().packet(0x1)\
            .gameId(gameId)\
            .data()\
            .number8bit(taggerId)\
            .data()\
            .number8bit((team << 3) + player)\
            .checksum()\
            .toMessage()


########################################################################
#
#  Generate Channel Failure Message
#      If we don't receive a confirmation from the
#      tagger of assignment. Fire 6 times at 0.5s
#
########################################################################
def genChannelFailure(gameId, taggerId):
    return MessageBuilder().packet(0x0F)\
            .gameId(gameId)\
            .data()\
            .number8bit(taggerId)\
            .checksum()\
            .toMessage()


########################################################################
#
#  Generate Debrief Data Request Message
#
########################################################################
def genRequestTagReport(gameId, team, player, team1Report, team2Report, team3Report, summary):
    flags = 0;
    if (team3Report):
        flags = flags | (1 << 3)
    if (team2Report):
        flags = flags | (1 << 2)
    if (team1Report):
        flags = flags | (1 << 1)
    if (summary):
        flags = flags | (1 << 0) 

    return MessageBuilder().packet(0x31)\
            .gameId(gameId)\
            .data()\
            .number8bit((team << 4) + player)\
            .data()\
            .number8bit(flags)\
            .checksum()\
            .toMessage()



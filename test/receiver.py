from gpiozero import Button
from time import monotonic
from signal import pause
from enum import Enum
from threading import Timer

BEACON_MAX_DURATION = 66000 # ns
TAG_MAX_DURATION = 52000 # ns
PACKET_MAX_DURATION = 52000 # ns

class EventType(Enum):
    UNKNOWN = 1
    START = 2
    PREAMBLE = 3
    ONE = 4
    ZERO = 5
    DELIMITER = 6
    BEACON = 8


class InputDirection(Enum):
    RISE = 1
    TROUGH = 2


class InputBound(Enum):
    LOW = 1
    HIGH = 2
    MID = 3


def calculateBounds(duration): 
    margin = 450 # nano second margin
    return { 
        InputBound.LOW: duration - margin,
        InputBound.MID: duration,
        InputBound.HIGH: duration + margin,
    }


EventBounds = {
    InputDirection.RISE: {
        EventType.ZERO: calculateBounds(1000),
        EventType.ONE: calculateBounds(2000),
        EventType.START: calculateBounds(3000),
        EventType.BEACON: calculateBounds(6000),
    },
    InputDirection.TROUGH: {
        EventType.DELIMITER: calculateBounds(2000),
        EventType.PREAMBLE: calculateBounds(6000),
    }
}

class TimeTracker(object):
    def __init__(self, onEdgeEvent):
        self.lastEdgeS = monotonic()
        self.onEdgeEvent = onEdgeEvent
        self.count = 0

    def onLight(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent(InputDirection.TROUGH, diffNS)
        self.lastEdgeS = now
        self.count = self.count + 1
        print("   DROP: " + str(diffNS) + " COUNT: " + str(self.count))

    def onDark(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent(InputDirection.RISE, diffNS)
        self.lastEdgeS = now
        print("   RISE: " + str(diffNS))


class MessageInputStream(object):
    def __init__(self, id):
        self.timeTracker = TimeTracker(self.onEdgeEvent)

        self.id = id
        self.stream = []
        print("STARTING LISTENER ON GPIO: " + str(id)) 

        self.button = Button(id)
        self.button.when_pressed = self.timeTracker.onLight
        self.button.when_released = self.timeTracker.onDark

    def parseBits(self, start, end):
        result = 0
        for i in range(start, end + 1):
            if (self.stream[i] == EventType.DELIMITER):
                continue
            elif (self.stream[i] == EventType.ONE): 
                result = (result << 1) + 1 
            elif (self.stream[i] == EventType.ZERO): 
                result = result << 1
            else:
                print('corrupt number')
                return 0

        return result 


    def parsePacket(self):
        if (len(self.stream) < 17):
            return

        # All messages must start with START
        if (self.stream[0] != EventType.START):
            print('corrupt start')
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            print('corrupt preamble')
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.START):
            print('corrupt tag');
            return

        packetType = self.parseBits(3,16)
        print("PACKET - TYPE %(packetType)d" % {"packetType": packetType})

    def parseTag(self):
        if (len(self.stream) < 17):
            return

        if (len(self.stream) > 17):
            messageTimer = Timer(PACKET_MAX_DURATION * 0.000001, self.parsePacket)
            messageTimer.start()
            return

        # All messages must start with START
        if (self.stream[0] != EventType.START):
            print('corrupt start')
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            print('corrupt preamble')
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.START):
            print('corrupt tag');
            return

        team = self.parseBits(3,6)
        player = self.parseBits(7,12)
        strength = self.parseBits(13,16)
        print("TAG - STRENGTH %(strength)d TEAM: %(team)d PLAYER: %(player)d" % 
          {"strength": strength, "player": player, "team": team})


    def parseBeacon(self):
        if (len(self.stream) < 13):
            return

        # All messages must start with START
        if (self.stream[0] != EventType.START):
            print('corrupt start')
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            print('corrupt preamble')
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.BEACON):
            print('corrupt beacon');
            return

        # This is an advanced beacon
        if (len(self.stream) == 21):
            tag = self.parseBits(3,4)
            shield = self.parseBits(5,6)
            life = self.parseBits(7,10)
            team = self.parseBits(11,14)
            player = self.parseBits(15,20)
            print("ENHANCED BEACON - TAG: %(tag)d SHEILD %(shield)d LIFE: %(life)d TEAM: %(team)d PLAYER %(player)d" % 
                    {"tag": tag, "shield": shield, "life": life, "team": team, "player": player})
        else:
            team = self.parseBits(3,6)
            tag = self.parseBits(7,8)
            flex = self.parseBits(9,13)
            # If the tag is 1 then we use the flex bits and it is a standard beacon
            # if it is zero, then if the flex is zero then it is standard
            zone = True 
            if (tag == 1): 
                zone = false
            elif (tag == 0 and flex == 0): 
                zone = false

            if (zone):
                print("ZONE BEACON - TAG: %(tag)d TYPE %(flex)d TEAM: %(team)d" % 
                    {"tag": tag, "flex": flex, "team": team})
            else:
                print("STANDARD BEACON - TAG: %(tag)d STRENGTH %(flex)d TEAM: %(team)d" % 
                    {"tag": tag, "flex": flex, "team": team})


    def onEdgeEvent(self, direction, durationNS):
        eventType = EventType.UNKNOWN
        eventBounds = EventBounds[direction]
        for key in eventBounds:
            bounds = eventBounds[key]
            if bounds[InputBound.LOW] < durationNS and bounds[InputBound.HIGH] > durationNS:
                eventType = key

        if (eventType == EventType.UNKNOWN):
            self.stream = []
        else:
            self.stream.append(eventType)

            if (eventType == EventType.BEACON):
                # For cases where we have to wait before fully parsing, we start a timer
                messageTimer = Timer(BEACON_MAX_DURATION * 0.000001, self.parseBeacon)
                messageTimer.start()

            if (eventType == EventType.START and len(self.stream) > 1):
                # For cases where we have to wait before fully parsing, we start a timer
                messageTimer = Timer(TAG_MAX_DURATION * 0.000001, self.parseTag)
                messageTimer.start()

        #if durationNS > 10000:
        #    print ("=======================================================");

        #print("ID: %(id)d DIRECTION: %(direction)s TYPE: %(type)s - %(diff)f (ns)" % {
        #    "id": self.id,
        #    "direction": direction.name,
        #    "type": eventType.name,
        #    "diff": durationNS
        #    })


stream = MessageInputStream(2)
pause()

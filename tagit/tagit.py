#
#  Copyright @ 2019 
#
#############################################################################
#
#  Common Reference Structures for Tag-It
#
#############################################################################
from signal import pause
from enum import Enum
from time import sleep, monotonic
from queue import Queue
from threading import Thread,Timer
from pigpio import pi, pulse, OUTPUT 
from gpiozero import Button

#
# Constants
#
BEACON_MAX_DURATION = 66000 # ns
TAG_MAX_DURATION = 52000 # ns
PACKET_MAX_DURATION = 52000 # ns

#
# Event Type
#
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
    VALLEY = 2

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

#
# Event Bounds Map
#
#  These numbers are derived off LTAP protocol
EventBounds = {
    InputDirection.RISE: {
        EventType.ZERO: calculateBounds(1000),
        EventType.ONE: calculateBounds(2000),
        EventType.START: calculateBounds(3000),
        EventType.BEACON: calculateBounds(6000),
    },
    InputDirection.VALLEY: {
        EventType.DELIMITER: calculateBounds(2000),
        EventType.PREAMBLE: calculateBounds(6000),
    }
}


#############################################################################
#
#  Message Receiver for Tag-It
#
#############################################################################
#
#  TODO: instrument to capture corrupt packets
#

class TimeTracker(object):
    def __init__(self, onEdgeEvent):
        self.lastEdgeS = monotonic()
        self.onEdgeEvent = onEdgeEvent
        self.count = 0

    def onLight(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent(InputDirection.VALLEY, diffNS)
        self.lastEdgeS = now
        self.count = self.count + 1

    def onDark(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent(InputDirection.RISE, diffNS)
        self.lastEdgeS = now

#
#  Open a GPIO and listen for Tag Messages
#
class MessageInputStream(object):
    def __init__(self, id):
        self.timeTracker = TimeTracker(self.onEdgeEvent)

        self.id = id
        self.stream = []
        self.button = None

    def start(self):
        if (self.button == None):
            self.button = Button(self.id)
            self.button.when_pressed = self.timeTracker.onLight
            self.button.when_released = self.timeTracker.onDark

    def parseBits(self, start, end):
        result = 0
        for i in range(start, end + 1):
            if (i >= len(self.stream)):
                return 0
            if (self.stream[i] == EventType.DELIMITER):
                continue
            elif (self.stream[i] == EventType.ONE): 
                result = (result << 1) + 1 
            elif (self.stream[i] == EventType.ZERO): 
                result = result << 1
            else:
                return 0

        return result 

    def parsePacket(self):
        if (len(self.stream) < 17):
            return

        # All messages must start with START
        if (self.stream[0] != EventType.START):
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.START):
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
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.START):
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
            return

        # All messages need PREAMBLE
        if (self.stream[1] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2] != EventType.BEACON):
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
                zone = False
            elif (tag == 0 and flex == 0): 
                zone = False

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


#############################################################################
#
#  Message Sender for Tag-It
#
#############################################################################
#
#  TODO: instrument send errors 
#  TODO: thread management destructor 
#

def listJoin(lst, item):
    result = [item] * (len(lst) * 2 - 1)
    result[0::2] = lst
    return result

#
#  This class follows a builder pattern, but order matters, so
#  in a sense it really isn't a builder
#
class MessageBuilder(object):
    def __init__(self):
        self.content = [EventType.START, EventType.PREAMBLE]

    def toMessage(self):
        return self.content

    def toString(self):
        value = ""
        for item in self.content:
            value += item.name + "\n"

        return value

    def beacon(self):
        self.content.append(EventType.BEACON)
        return self

    def tag(self):
        self.content.append(EventType.START)
        return self

    def zero(self):
        self.content.append(EventType.DELIMITER)
        self.content.append(EventType.ZERO)
        return self

    def one(self):
        self.content.append(EventType.DELIMITER)
        self.content.append(EventType.ONE)
        return self

    def flag(self, bit):
        if (bit):
            return self.one()
        else:
            return self.zero()

    def packet(self, type):
        return self.tag().number8bit(type).zero()

    def gameId(self, id):
        return self.number8bit(id)

    def numberXbit(self, size, number):
        if (number >= 2 ** size): 
            raise Exception('number cannot be larger than or equal to ' + str(2 ** size))

        bits = []
        while(number != 0):
            bit = number & 0x1
            bits.insert(0, EventType.ZERO if bit == 0 else EventType.ONE)
            number = number >> 1

        for n in range(len(bits), size):
            bits.insert(0, EventType.ZERO)

        self.content.append(EventType.DELIMITER)
        self.content.extend(listJoin(bits, EventType.DELIMITER))
        return self

    def team(self, number):
        return self.numberXbit(2, number)

    def player(self, number):
        return self.numberXbit(3, number)

    def number2bit(self, number):
        return self.numberXbit(2, number)

    def number4bit(self, number):
        return self.numberXbit(4, number)

    def number8bit(self, number):
        return self.numberXbit(8, number)

    # Encode Binary Coded Decimal
    def numberDbit(self, number):
        # If the number is larger than max, we normalize to INFINITY
        # by rturning the INFINITY constant
        if (number > 99):
            # append 0xFF
            return self.number8bit(0xFF)

        leftByte = int(number / 10)
        rightByte = number % 10
        return self.number4bit(leftByte).number4bit(rightByte)

    def textXsize(self, size, value):
        if (len(value) > size):
            raise Exception('Exceeds max text length of ' + str(size))

        # TODO: fill out support

        return self


#
# Message Sender
#
class MessageOutputStream(object):
    def __init__(self, id):
        print("STARTING SENDER ON GPIO: " + str(id))
        self.id = id

        self.q = Queue()
        self.pi = pi()

        self.t = Thread(target = self.worker)
        self.t.start()

    def destroy(self):
        this.send(None)

    def carrierOff(self, durationNS):
        flash = []
        flash.append(pulse(0, 1<<self.id, durationNS))
        return flash;

    def carrier38khz(self, durationNS):
        cycles = int(durationNS/1000 * 38)

        flash = []
        for i in range(0, cycles):
            flash.append(pulse(1<<self.id, 0, int(500/38)))
            flash.append(pulse(0, 1<<self.id, int(500/38)))

        return flash

    def send(self, message):
        self.q.put(message)

    #
    # Background Worker
    #
    def worker(self):
        while True:
            message = self.q.get()
            if message is None:
                break

            #
            # We construct the entire message into a single wave form
            # this is so that the underlying pi module can send it all
            # without python performance getting in the way
            #
            wave = []
            self.pi.wave_clear();


            for item in message:
                if (item in EventBounds[InputDirection.RISE]): 
                    part = self.carrier38khz(EventBounds[InputDirection.RISE][item][InputBound.MID])
                    wave.extend(part)

                if (item in EventBounds[InputDirection.VALLEY]): 
                    part = self.carrierOff(EventBounds[InputDirection.VALLEY][item][InputBound.MID])
                    wave.extend(part)

            self.pi.wave_add_generic(wave)
            wid = self.pi.wave_create()
            self.pi.wave_send_once(wid)

            while self.pi.wave_tx_busy():
                sleep(0.0001)

            self.pi.write(self.id, 0)
            self.q.task_done()





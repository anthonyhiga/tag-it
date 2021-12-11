#
#  Copyright @ 2019 
#
#############################################################################
#
#  Common Reference Structures for Tag-It
#
#############################################################################
import sys, traceback
from enum import Enum
from time import sleep, monotonic
from queue import Queue
from threading import Thread,Timer,Lock
from pigpio import pi, pulse, OUTPUT, EITHER_EDGE
from gpiozero import Button

GLOBAL_PI = pi()
GLOBAL_PI.wave_clear()

#
# Constants
#
WAIT_ON_BITS_PARSE_DURATION = 4000 * 0.000001 #ns

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
    PAUSE = 9
    END = 10

class InputDirection(Enum):
    RISE = 1
    VALLEY = 2
    END = 3

class InputBound(Enum):
    LOW = 1
    HIGH = 2
    MID = 3
    IGNORE = 4

def calculateBounds(duration, ignore, lowerMargin, upperMargin): 
    return { 
        InputBound.LOW: duration - lowerMargin,
        InputBound.MID: duration,
        InputBound.HIGH: duration + upperMargin,
        InputBound.IGNORE: ignore,
    }

#
# Event Bounds Map
#
#  These numbers are derived off LTAP protocol
EventBounds = {
    InputDirection.END: {
        # Nothing...
    },
    InputDirection.RISE: {
        EventType.ZERO: calculateBounds(1000, False, 800, 200),
        EventType.ONE: calculateBounds(2000, False, 800, 500),
        EventType.START: calculateBounds(3000, False, 500, 2000),
        EventType.BEACON: calculateBounds(6000, False, 1000, 1000),
    },
    InputDirection.VALLEY: {
        EventType.DELIMITER: calculateBounds(2000, False, 1800, 3000),
        EventType.PREAMBLE: calculateBounds(6000, False, 1000, 3000),
        EventType.PAUSE: calculateBounds(20000, True, 4000, 4000),
        EventType.END: calculateBounds(75000, True, 4000, 4000),
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
    def __init__(self, onEdgeEvent, onEndEvent, pi):
        self.pi = pi

        self.lastEdgeS = monotonic()
        self.lastEdgeTick = self.pi.get_current_tick()
        self.lastEdgeValue = 3

        self.onEdgeEvent = onEdgeEvent
        self.onEndEvent = onEndEvent
        self.lastEventType = 3 

    def onEndEvent(self, tick):
        self.onEndEvent()

    def onLightTick(self, tick):
        if (self.lastEdgeValue == InputDirection.VALLEY): 
            return

        if (tick < self.lastEdgeTick):
            self.lastEdgeTick = tick 
            return

        diffNS = (tick - self.lastEdgeTick)

        if (diffNS < 300):
            return

        self.lastEdgeTick = tick 
        self.lastEdgeValue = InputDirection.VALLEY

        self.onEdgeEvent(InputDirection.VALLEY, diffNS)

    def onDarkTick(self, tick):
        if (self.lastEdgeValue == InputDirection.RISE):
            return

        if (tick < self.lastEdgeTick):
            self.lastEdgeTick = tick 
            return

        diffNS = (tick - self.lastEdgeTick)

        if (diffNS < 300):
            return

        self.lastEdgeTick = tick 
        self.lastEdgeValue = InputDirection.RISE

        self.onEdgeEvent(InputDirection.RISE, diffNS)

#
#  Open a GPIO and listen for Tag Messages
#
class MessageInputStream(object):
    def __init__(self, id, handlers):
        print("STARTING RECEIVER ON GPIO: " + str(id))

        self.handlers = handlers
        self.id = id
        self.stream = []
        self.reader = None
        self.timer = None
        self.pi = GLOBAL_PI
        self.q = Queue() 
        self.silence = False
        self.messageSequence = 0
        self.firedEdgeEvent = False

        self.timeTracker = TimeTracker(self.onEdgeEvent, self.onEndEvent, self.pi)

        # Used to Verify Checksum
        self.packetCheckTotal = 0
        self.lastByte = 0 
        self.message = []

        self.t = Thread(target = self.worker)
        self.t.start()

    def resetStream(self):
        self.stream = []
        self.messageSequence = self.messageSequence + 1

    def setSilent(self, value):
        #self.silence = value
        False

    def start(self):
        self.pi.callback(self.id, EITHER_EDGE, self.onChange) 
        self.pi.set_watchdog(self.id, 3)

    def onChange(self, gpio, level, tick):
        if (gpio != self.id):
            return

        if (level == 1):
          self.timeTracker.onDarkTick(tick)
        elif (level == 0):
          self.timeTracker.onLightTick(tick)
        elif (level == 2):
          self.timeTracker.onEndEvent()

    def parseStart(self):
        self.index = 3

    def parse1bit(self):
        index = self.index
        self.index = self.index + 2
        return self.parseBits(index, index + 2)

    def parse2bit(self):
        index = self.index
        self.index = self.index + 4 
        return self.parseBits(index, index + 4)

    def parse3bit(self):
        index = self.index
        self.index = self.index +  6
        return self.parseBits(index, index + 6)

    def parse4bit(self):
        index = self.index
        self.index = self.index + 8 
        return self.parseBits(index, index + 8)

    def parse8bit(self):
        index = self.index
        self.index = self.index + 16
        return self.parseBits(index, index + 16)

    def parseDbit(self):
        index = self.index
        self.index = self.index + 16
        dec = self.parseBits(index, index + 8)
        single = self.parseBits(index + 8, index + 16)
        if (dec > 9):
          return 100
        return dec * 10 + single

    def parseBits(self, start, end):
        result = 0
        for i in range(start, end):
            if (i >= len(self.stream)):
                return 0
            if (self.stream[i]['event'] == EventType.DELIMITER):
                continue
            elif (self.stream[i]['event'] == EventType.ONE): 
                result = (result << 1) + 1 
            elif (self.stream[i]['event'] == EventType.ZERO): 
                result = result << 1
            else:
                return 0

        return result 

    def dumpStream(self, type):
        None
        #name = str(monotonic()) + "_" + type + "_event_tagit.log"
        #f = open("/tmp/" + name, "w")
        #for item in self.stream:
        #    f.write(str(item['event']) + ": " + str(item['direction']) + " - " + str(item['duration']) + "\n")
        #f.close()

    def parsePacket(self):
        if (len(self.stream) < 19):
            return False 

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.START):
            return True 

        self.parseStart()

        # we're looking at a data packet
        if (len(self.stream) == 19):
          data = self.parse8bit()

          self.packetCheckTotal = self.packetCheckTotal + self.lastByte
          self.message.append(self.lastByte)

          self.lastByte = data

          # print("DATA - DATA %(data)d" % {"data": data})
          self.dumpStream('DATA_' + str(data))

          # We don't clear the stream just yet
          return False 

        elif(len(self.stream) == 21):
          # We clear the handler since we got a packet which is complete

          first = self.parse1bit() # drop the extra bit
          if (first == 0):
            packetType = self.parse8bit()
            self.packetCheckTotal = 0
            self.lastByte = packetType 
            self.message = []
            # print("PACKET - TYPE %(packetType)d" % {"packetType": packetType})
            self.dumpStream('PACKET_' + str(packetType))
          else:
            checkSum = int(self.parse8bit())

            self.packetCheckTotal = self.packetCheckTotal + self.lastByte
            self.message.append(self.lastByte)

            packetCheckSum = int(self.packetCheckTotal & 0xFF)
            # print("PACKET - CHECKSUM %(checkSum)d" % {"checkSum": checkSum})
            try:
                if (checkSum == packetCheckSum):
                    self.dumpStream('GOOD_CHECKSUM_' + str(checkSum) + "_" + str(packetCheckSum))
                    # print("GOOD PACKET - CHECKSUM " + str(checkSum)  + " == " + str(packetCheckSum)) 
                    self.handlers['onPacket'](self.message)
                else:
                    self.dumpStream('BAD_CHECKSUM_' + str(checkSum) + "_" + str(packetCheckSum))
                    # print("BAD PACKET - CHECKSUM " + str(checkSum)  + " == " + str(packetCheckSum)) 
            except:
                print("Unexpected error:", sys.exc_info()[0])
                traceback.print_tb(sys.exc_info()[2])

            return True


    def parseTag(self):
        if (len(self.stream) < 17):
            return False

        # if this is larger than 7 bits, we're dealing with a packet
        if (len(self.stream) > 17):
            return self.parsePacket()

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.START):
            # Signal we have a bad stream
            return True

        self.parseStart()
        team = self.parse2bit()
        player = self.parse3bit()
        strength = self.parse2bit()
        # print("TAG - STRENGTH %(strength)d TEAM: %(team)d PLAYER: %(player)d" % 
        #  {"strength": strength, "player": player, "team": team})

        self.dumpStream('TAG')
        try:
            self.handlers['onTag'](team, player, strength)

        except:
            print("Unexpected error:", sys.exc_info()[0])
            traceback.print_tb(sys.exc_info()[2])

        # Tag Parsing doesn't clear the stream
        return False 

    def parseBeacon(self):
        if (len(self.stream) != 21 and len(self.stream) != 13):
            return False

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.BEACON):
            # Signal we have a bad stream
            return True

        self.parseStart()

        try:
            # This is an advanced beacon
            if (len(self.stream) >= 21):
                tag = self.parse1bit()
                shield = self.parse1bit()
                life = self.parse2bit()
                team = self.parse2bit()
                player = self.parse3bit()
                # print("ENHANCED BEACON - TAG: %(tag)d SHEILD %(shield)d LIFE: %(life)d TEAM: %(team)d PLAYER %(player)d" % 
                #    {"tag": tag, "shield": shield, "life": life, "team": team, "player": player})
                self.dumpStream('ADVBEACON')
                self.handlers['onAdvancedBeacon'](team, player, tag, shield, life)
            else:
                team = self.parse2bit()
                tag = self.parse1bit()
                flex = self.parse2bit()

                # If the tag is 1 then we use the flex bits and it is a standard beacon
                # if it is zero, then if the flex is zero then it is standard
                zone = True 
                if (tag == 1): 
                    zone = False
                elif (tag == 0 and flex == 0): 
                    zone = False

                self.dumpStream('BEACON')
                if (zone):
                    # print("ZONE BEACON - TAG: %(tag)d TYPE %(flex)d TEAM: %(team)d" % 
                    #    {"tag": tag, "flex": flex, "team": team})
                    self.handlers['onZoneBeacon'](team, tag, flex)
                else:
                    # print("STANDARD BEACON - TAG: %(tag)d STRENGTH %(flex)d TEAM: %(team)d" % 
                    #    {"tag": tag, "flex": flex, "team": team})
                    self.handlers['onStandardBeacon'](team, tag)

        except:
            print("Unexpected error:", sys.exc_info()[0])
            traceback.print_tb(sys.exc_info()[2])

        return True

    def hasInvalidHeader(self):
        if (len(self.stream) <= 1):
            return False 

        # All messages must start with START
        if (self.stream[0]['event'] != EventType.START):
            return True

        # All messages need PREAMBLE
        if (self.stream[1]['event'] != EventType.PREAMBLE):
            return True

        return False

    def parseMessage(self):
        try:
            if (len(self.stream) < 13):
                return False

            result = False
            # Message neither a BEACON or TAG
            if (self.stream[2]['event'] == EventType.BEACON):
                return self.parseBeacon()
            else:
                return self.parseTag()

        except:
            print("Unexpected error:", sys.exc_info()[0])
            traceback.print_tb(sys.exc_info()[2])

    def onEndEvent(self):
        if (self.silence):
            return

        if self.firedEdgeEvent:
            self.firedEdgeEvent = False
            self.q.put({
                "direction": InputDirection.END,
                "durationNS": 0
            })

    def onEdgeEvent(self, direction, durationNS):
        if (self.silence):
            return

        self.firedEdgeEvent = True
        self.q.put({
            "direction": direction,
            "durationNS": durationNS
        })

    def processEvent(self, direction, durationNS):
        # If the bus is silenced, we stop listening
        if (self.silence):
            self.resetStream()
            return

        eventType = EventType.UNKNOWN
        eventBounds = EventBounds[direction]
        distance = 0
        for key in eventBounds:
            bounds = eventBounds[key]
            if bounds[InputBound.IGNORE]:
                continue

            if bounds[InputBound.LOW] < durationNS and bounds[InputBound.HIGH] > durationNS:
                distance = abs(durationNS - bounds[InputBound.MID])
                eventType = key

        ######################################################################
        # Special Event Handling
        # print(str(direction) + ":  " + str(durationNS) + " - " + str(eventType) + " <--> " + str(distance))
        #if distance > 100 and durationNS < 12000:
        #    print(str(direction) + ":  " + str(durationNS) + " - " + str(eventType) + " <--> " + str(distance))

        if (eventType == EventType.PREAMBLE):
            # if we get a preamble, we assume we're starting all over 
            self.resetStream()
            self.stream.append({
                'event': EventType.START,
                'duration': durationNS,
                'direction': direction,
            })
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            return

        if (eventType == EventType.UNKNOWN and direction != InputDirection.END):
            # If the stream less than 8 bits, we dump it
            if (len(self.stream) < 17):
                # print("UNKNOWN -------------------- " + str(durationNS) + " " + str(direction))
                self.stream.append({
                    'event': eventType,
                    'duration': durationNS,
                    'direction': direction,
                })
                self.dumpStream("UNKNOWN")
                self.resetStream()
                return

        ######################################################################
        # Pre Event Transforms
        if ((eventType == EventType.ZERO or eventType == EventType.ONE) and len(self.stream) == 2):
            # if we have gotten a valid preamble, then we error correct for the start
            # because we can assume any kind of signal is the start
            eventType = EventType.START

        ######################################################################
        # Stream Event Handling 
        if (eventType == EventType.BEACON):
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })

        elif (eventType == EventType.DELIMITER):
            if len(self.stream) == 0:
                return

            # This is an extra large DELIMITER, there is a good chance
            # this time was stolen from the previous value, we'll up the value
            # if the last value is a zero
            if (durationNS > 2700):
                if (self.stream[-1]['event'] == EventType.ZERO):
                    self.stream[-1]['event'] = EventType.ONE

            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })

        elif (eventType == EventType.START
                or eventType == EventType.ZERO
                or eventType == EventType.ONE):
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })

        elif (direction != InputDirection.END):
            # print("Throwing away bad data: " + str(eventType) + " : " + str(len(self.stream)))
            # print("BAD -------------------- " + str(durationNS))
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            self.dumpStream('BAD_DATA')
            self.resetStream()
            return

        ######################################################################
        # Skip parsing if the message is short
        if (len(self.stream) < 13):
            return

        ######################################################################
        # Clear the Plate if the existing data is garbage 
        if self.hasInvalidHeader():
            return

        if (direction == InputDirection.END):
            self.parseMessage()

    #
    # Background Worker, we want to process the data
    # in the background so that the reader thread can charge forward
    #
    def worker(self):
        while True:
            event = self.q.get()
            if event is None:
                self.q.task_done()
                break

            self.processEvent(event['direction'], event['durationNS'])
            self.q.task_done()

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
        self.checktotal = 0

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

    def end(self):
        self.content.append(EventType.END)
        return self

    def pause(self):
        self.content.append(EventType.PAUSE)
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

    def begin(self):
        self.content.append(EventType.START)
        self.content.append(EventType.PREAMBLE)
        self.content.append(EventType.START)
        return self

    def data(self):
        return self.pause().begin()

    def packet(self, type):
        result = self.tag().zero().number8bit(type).pause().begin()
        self.checktotal = type
        return result

    def checksum(self):
        checksum = (self.checktotal | 0x100) & 0x1FF
        return self.data().numberXbit(9, checksum).end()

    def gameId(self, id):
        return self.number8bit(id)

    def numberXbit(self, size, number):
        if (number >= 1 << size): 
            raise Exception(str(number) + ' cannot be larger than or equal to ' + str(2 << size))

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
        # bytes are special as they are checksum data
        self.checktotal = self.checktotal + number
        return self.numberXbit(8, number)

    # Encode Binary Coded Decimal
    def numberDbit(self, number):
        # If the number is larger than max, we normalize to INFINITY
        # by rturning the INFINITY constant
        if (number > 99):
            # append 0xFF
            return self.number8bit(0xFF)

        leftByte = int(number / 10) << 4
        rightByte = number % 10
        byte = leftByte + rightByte

        return self.number8bit(byte)

    def textXsize(self, size, value):
        if (len(value) > size):
            raise Exception('Exceeds max text length of ' + str(size))

        # TODO: fill out support

        return self

#
# Message Sender
#
messageOutputStreamLock = Lock()
class MessageOutputStream(object):
    def __init__(self, id, isBusy):
        print("STARTING SENDER ON GPIO: " + str(id))
        self.id = id

        self.isBusy = isBusy
        self.pi = GLOBAL_PI
        self.q = Queue()
        self.buildWaveForms()

        self.t = Thread(target = self.worker)
        self.t.start()

    def defineWave(self, wave):
        self.pi.wave_add_generic(wave)
        return self.pi.wave_create()

    def buildWaveForms(self):
        self.rise = {
                1000: self.defineWave(self.carrier38khz(1000)),
                2000: self.defineWave(self.carrier38khz(2000)),
                3000: self.defineWave(self.carrier38khz(3000)),
                6000: self.defineWave(self.carrier38khz(6000)),
        } 
        self.valley = {
                2000: self.defineWave(self.carrierOff(2000)),
                6000: self.defineWave(self.carrierOff(6000)),
                20000: self.defineWave(self.carrierOff(20000)),
                75000: self.defineWave(self.carrierOff(75000)),
        }

    def destroy(self):
        self.send(None)

    def carrierOff(self, durationNS):
        flash = []
        flash.append(pulse(0, 1<<self.id, int(durationNS/2/4)))
        flash.append(pulse(0, 1<<self.id, int(durationNS/2/4)))
        flash.append(pulse(0, 1<<self.id, int(durationNS/2/4)))
        flash.append(pulse(0, 1<<self.id, int(durationNS/2/4)))
        return flash;

    def carrier38khz(self, durationNS):
        cycles = int(durationNS/2000 * 38)

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
        global messageOutputStreamLock
        while True:
            try:
                message = self.q.get()
                self.q.task_done()
                messageOutputStreamLock.acquire()
                if message is None:
                    continue

                self.isBusy(True)

                #
                # We construct the entire message into a single wave form
                # this is so that the underlying pi module can send it all
                # without python performance getting in the way
                #
                wave = []
                for item in message:
                    duration = 0
                    if (item in EventBounds[InputDirection.RISE]): 
                        duration = EventBounds[InputDirection.RISE][item][InputBound.MID]
                        part = self.rise[duration]
                        wave.append(part)

                    if (item in EventBounds[InputDirection.VALLEY]): 
                        duration = EventBounds[InputDirection.VALLEY][item][InputBound.MID] 
                        part = self.valley[duration]
                        wave.append(part)

                self.pi.wave_chain(wave)
                while(self.pi.wave_tx_busy()):
                    sleep(0.0001)

                self.pi.write(self.id, 0)
                self.isBusy(False)

            except:
                print("Unexpected error:", sys.exc_info()[0])
                traceback.print_tb(sys.exc_info()[2])

            finally:
                messageOutputStreamLock.release()


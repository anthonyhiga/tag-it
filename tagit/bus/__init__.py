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
WAIT_PARSE_DURATION = 48000 * 1.1 # ns

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
    FIRED = 11

class InputDirection(Enum):
    RISE = 1
    VALLEY = 2

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
    InputDirection.RISE: {
        EventType.ZERO: calculateBounds(1000, False, 500, 500),
        EventType.ONE: calculateBounds(2000, False, 500, 500),
        EventType.START: calculateBounds(3000, False, 500, 2000),
        EventType.BEACON: calculateBounds(6000, False, 1000, 1000),
    },
    InputDirection.VALLEY: {
        EventType.DELIMITER: calculateBounds(2000, False, 1000, 1000),
        EventType.PREAMBLE: calculateBounds(6000, False, 1000, 1000),
        EventType.PAUSE: calculateBounds(25000, True, 0, 0),
        EventType.END: calculateBounds(80000, True, 0, 0),
        EventType.FIRED: calculateBounds(56000, True, 56000, 56000),
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
    def __init__(self, onEdgeEvent, pi):
        self.pi = pi

        self.lastEdgeS = monotonic()
        self.lastEdgeTick = self.pi.get_current_tick()
        self.lastEdgeValue = 3

        self.onEdgeEvent = onEdgeEvent
        self.count = 0
        self.lastEventType = 3 

    def onLight(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000

        if (diffNS < 500):
            return

        self.onEdgeEvent(InputDirection.VALLEY, diffNS)
        self.lastEdgeS = now
        self.count = self.count + 1

    def onDark(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000

        if (diffNS < 500):
            return

        self.onEdgeEvent(InputDirection.RISE, diffNS)
        self.lastEdgeS = now

    def onLightTick(self, tick):
        if (self.lastEdgeValue == InputDirection.VALLEY): 
            return

        diffNS = (tick - self.lastEdgeTick)

        if (diffNS < 300):
            return

        self.lastEdgeTick = tick 
        self.lastEdgeValue = InputDirection.VALLEY
        self.count = self.count + 1

        self.onEdgeEvent(InputDirection.VALLEY, diffNS)

    def onDarkTick(self, tick):
        if (self.lastEdgeValue == InputDirection.RISE):
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
        self.messageParserLock = Lock()

        self.timeTracker = TimeTracker(self.onEdgeEvent, self.pi)

        # Used to Verify Checksum
        self.packetCheckTotal = 0
        self.message = []

        self.t = Thread(target = self.worker)
        self.t.start()

    def setSilent(self, value):
        #self.silence = value
        False

    def start(self):
        #if (self.reader == None):
        #    self.reader = Button(self.id)
        #    self.reader.when_pressed = self.timeTracker.onLight
        #    self.reader.when_released = self.timeTracker.onDark
        self.pi.callback(self.id, EITHER_EDGE, self.onChange) 

    def onChange(self, gpio, level, tick):
        if (gpio != self.id):
            return

        if (level == 1):
          self.timeTracker.onDarkTick(tick)
        elif (level == 0):
          self.timeTracker.onLightTick(tick)

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
            return

        # All messages must start with START
        if (self.stream[0]['event'] != EventType.START):
            return

        # All messages need PREAMBLE
        if (self.stream[1]['event'] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.START):
            return

        self.parseStart()

        # we're looking at a data packet
        if (len(self.stream) == 19):
          data = self.parse8bit()
          self.packetCheckTotal = self.packetCheckTotal + data 
          self.message.append(data)
          # print("DATA - DATA %(data)d" % {"data": data})
          self.dumpStream('DATA_' + str(data))
        else:
          first = self.parse1bit() # drop the extra bit
          if (first == 0):
            packetType = self.parse8bit()
            self.packetCheckTotal = packetType 
            self.message = [packetType]
            # print("PACKET - TYPE %(packetType)d" % {"packetType": packetType})
            self.dumpStream('PACKET_' + str(packetType))
          else:
            checkSum = int(self.parse8bit())
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



    def parseTag(self):
        if (len(self.stream) < 17):
            return

        # if this is larger than 7 bits, we're dealing with a packet
        if (len(self.stream) > 17):
            self.parsePacket()
            return

        # All messages must start with START
        if (self.stream[0]['event'] != EventType.START):
            return

        # All messages need PREAMBLE
        if (self.stream[1]['event'] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.START):
            return

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

    def parseBeacon(self):
        if (len(self.stream) < 13):
            return

        # All messages must start with START
        if (self.stream[0]['event'] != EventType.START):
            return

        # All messages need PREAMBLE
        if (self.stream[1]['event'] != EventType.PREAMBLE):
            return

        # Message neither a BEACON or TAG
        if (self.stream[2]['event'] != EventType.BEACON):
            return

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


    def parseMessage(self):
        self.messageParserLock.acquire()
        # print("MESSAGE")
        try:
            if (len(self.stream) < 13):
                return

            # All messages must start with START
            if (self.stream[0]['event'] != EventType.START):
                return

            # All messages need PREAMBLE
            if (self.stream[1]['event'] != EventType.PREAMBLE):
                return

            # Message neither a BEACON or TAG
            if (self.stream[2]['event'] == EventType.BEACON):
                self.parseBeacon()
            else:
                self.parseTag()

            self.stream = []

        finally:
            self.messageParserLock.release()

    def parseEnd(self):
        if (len(self.stream) < 13):
            return

        #print("END")
        self.parseMessage()

    def parseDelayed(self):
        if (len(self.stream) < 13):
            return

        #print("DELAYED")
        self.parseMessage()

    def onEdgeEvent(self, direction, durationNS):
        if (self.silence):
            return

        self.q.put({
            "direction": direction,
            "durationNS": durationNS
        })

    def processEvent(self, direction, durationNS):
        if (self.silence):
            self.stream = []
            return

        eventType = EventType.UNKNOWN
        eventBounds = EventBounds[direction]
        for key in eventBounds:
            bounds = eventBounds[key]
            if bounds[InputBound.IGNORE]:
                continue

            if bounds[InputBound.LOW] < durationNS and bounds[InputBound.HIGH] > durationNS:
                eventType = key

        # print(str(direction) + ":  " + str(durationNS) + " - " + str(eventType))
        if (eventType == EventType.PREAMBLE and len(self.stream) == 0):
            # if we just got a preamble, but missed the start, we can try to bootstrap
            # this message
            self.stream.append({
                'event': EventType.START,
                'duration': durationNS,
                'direction': direction,
            })

        if ((eventType == EventType.ZERO or eventType == EventType.ONE) and len(self.stream) == 0):
            # if we are starting from scratch, a zero or one also works as a start
            eventType = EventType.START

        if ((eventType == EventType.ZERO or eventType == EventType.ONE) and len(self.stream) == 2):
            # if we have gotten a valid preamble, then we error correct for the start
            # because we can assume any kind of signal is the start
            eventType = EventType.START

        if (eventType == EventType.UNKNOWN):
            # If the stream is 8 bits, we parse it
            if (len(self.stream) >= 17):
                # message is 8 bits, we we just need to wait a bit
                self.parseEnd()
            else:
                #print("UNKNOWN -------------------- " + str(durationNS))
                self.stream.append({
                    'event': eventType,
                    'duration': durationNS,
                    'direction': direction,
                })
                self.dumpStream("UNKNOWN")
                self.stream = []

        # We do header validation here
        elif (eventType != EventType.START and len(self.stream) == 0):
            # print("Throwing away bad start: " + str(eventType) + " : " + str(len(self.stream)))
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            self.dumpStream('BAD_START')
            self.stream = []
        elif (eventType != EventType.PREAMBLE and len(self.stream) == 1):
            # print("Throwing away bad preamble: " + str(eventType) + " : " + str(len(self.stream)))
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            self.dumpStream('BAD_PREAMBLE')
            self.stream = []
        elif ((eventType != EventType.BEACON 
            and eventType != EventType.START) 
                and len(self.stream) == 2):
            # print("Throwing away bad header: " + str(eventType) + " : " + str(len(self.stream)))
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            self.dumpStream('BAD_HEADER')
            self.stream = []
        elif (eventType == EventType.BEACON):
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })

            if (self.timer):
              self.timer.cancel()
            self.timer = Timer(WAIT_PARSE_DURATION * 0.000001, self.parseDelayed)
            self.timer.start()
        elif (eventType == EventType.DELIMITER):
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
                or eventType == EventType.PREAMBLE
                or eventType == EventType.ZERO
                or eventType == EventType.ONE):
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })

            if (len(self.stream) >= 21):
                # message is long enough, trigger parse now
                self.parseEnd()
            if (len(self.stream) >= 19):
                # message is 8 bits, we we just need to wait a bit
                if (self.timer):
                  self.timer.cancel()
                self.timer = Timer((5000)* 0.000001, self.parseDelayed)
                self.timer.start()
        else:
            # print("Throwing away bad data: " + str(eventType) + " : " + str(len(self.stream)))
            self.stream.append({
                'event': eventType,
                'duration': durationNS,
                'direction': direction,
            })
            self.dumpStream('BAD_DATA')
            #self.parseEnd()
            self.stream = []

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

    def fired(self):
        self.content.append(EventType.FIRED)
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
                25000: self.defineWave(self.carrierOff(25000)),
                56000: self.defineWave(self.carrierOff(56000)),
                80000: self.defineWave(self.carrierOff(80000)),
        }

    def destroy(self):
        self.send(None)

    def carrierOff(self, durationNS):
        flash = []
        flash.append(pulse(0, 1<<self.id, int(durationNS/2)))
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
            messageOutputStreamLock.acquire()
            try:
                message = self.q.get()
                if message is None:
                   self.q.task_done()
                   break 

                self.isBusy(True)

                #
                # We construct the entire message into a single wave form
                # this is so that the underlying pi module can send it all
                # without python performance getting in the way
                #
                wave = []
                totalDuration = 0

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

                    totalDuration = totalDuration + duration

                self.pi.wave_chain(wave)
                sleep(totalDuration / 1000000)

                self.pi.write(self.id, 0)
                self.isBusy(False)
                self.q.task_done()

            except:
                print("Unexpected error:", sys.exc_info()[0])
                traceback.print_tb(sys.exc_info()[2])

            finally:
                messageOutputStreamLock.release()


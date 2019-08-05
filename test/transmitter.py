from signal import pause
from enum import Enum
from time import sleep
from queue import Queue
from threading import Thread
from threading import Timer 
from pigpio import pi, pulse, OUTPUT 


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


class MessageOutputStream(object):
    def __init__(self, id):
        self.id = id

        self.q = Queue()

        print("STARTING SENDER ON GPIO: " + str(id))

        self.pi = pi()

        self.t = Thread(target = self.worker)
        self.t.start()

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

                if (item in EventBounds[InputDirection.TROUGH]): 
                    part = self.carrierOff(EventBounds[InputDirection.TROUGH][item][InputBound.MID])
                    wave.extend(part)

            self.pi.wave_add_generic(wave)
            wid = self.pi.wave_create()
            self.pi.wave_send_once(wid)

            while self.pi.wave_tx_busy():
                sleep(0.0001)

            self.pi.write(self.id, 0)
            self.q.task_done()

output = MessageOutputStream(24)

message = MessageBuilder().tag().team(0).player(1).number2bit(0).toMessage() 
while True:
  output.send(message)
  sleep(2)

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from threading import Thread 
from time import sleep, monotonic

class RFID(object):
    def __init__(self, onId):
        print("BOOTING - RFID")
        self.reader = SimpleMFRC522()
        self.onId = onId
        self.lastId = 0

        id = int(monotonic() * 1000)
        print("SETTING ID: " + str(id))
        self.onId(id)

        self.start()

    def loop(self):
        try:
            while True:
                id = self.reader.read_id()
                if id != self.lastId:
                    print("UPDATING ID: " + str(id))
                    self.lastId = id
                    self.onId(int(monotonic() * 1000))
                    # self.onId(id)

                sleep(0.25)

        finally:
            GPIO.cleanup()


    def start(self):
        self.t = Thread(target = self.loop)
        self.t.start()


import RPi.GPIO as GPIO
from mfrc522 import MFRC522
from threading import Thread 
from time import sleep, monotonic, time

class DeviceMFRC522:
  READER = None
  
  KEY = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
  BLOCK_ADDRS = [8, 9, 10]
  
  def __init__(self, id):
    self.READER = MFRC522(device=id)
  
  def read(self):
      id, text = self.read_no_block()
      while not id:
          id, text = self.read_no_block()
      return id, text

  def read_id(self):
    id = self.read_id_no_block()
    while not id:
      id = self.read_id_no_block()
      sleep(1)

    return id

  def read_id_no_block(self):
      (status, TagType) = self.READER.MFRC522_Request(self.READER.PICC_REQIDL)
      if status != self.READER.MI_OK:
          return None
      (status, uid) = self.READER.MFRC522_Anticoll()
      if status != self.READER.MI_OK:
          return None
      return self.uid_to_num(uid)
  
  def read_no_block(self):
    (status, TagType) = self.READER.MFRC522_Request(self.READER.PICC_REQIDL)
    if status != self.READER.MI_OK:
        return None, None
    (status, uid) = self.READER.MFRC522_Anticoll()
    if status != self.READER.MI_OK:
        return None, None
    id = self.uid_to_num(uid)
    self.READER.MFRC522_SelectTag(uid)
    status = self.READER.MFRC522_Auth(self.READER.PICC_AUTHENT1A, 11, self.KEY, uid)
    data = []
    text_read = ''
    if status == self.READER.MI_OK:
        for block_num in self.BLOCK_ADDRS:
            block = self.READER.MFRC522_Read(block_num) 
            if block:
                data += block
        if data:
             text_read = ''.join(chr(i) for i in data)
    self.READER.MFRC522_StopCrypto1()
    return id, text_read
    
  def write(self, text):
      id, text_in = self.write_no_block(text)
      while not id:
          id, text_in = self.write_no_block(text)
      return id, text_in

  def write_no_block(self, text):
      (status, TagType) = self.READER.MFRC522_Request(self.READER.PICC_REQIDL)
      if status != self.READER.MI_OK:
          return None, None
      (status, uid) = self.READER.MFRC522_Anticoll()
      if status != self.READER.MI_OK:
          return None, None
      id = self.uid_to_num(uid)
      self.READER.MFRC522_SelectTag(uid)
      status = self.READER.MFRC522_Auth(self.READER.PICC_AUTHENT1A, 11, self.KEY, uid)
      self.READER.MFRC522_Read(11)
      if status == self.READER.MI_OK:
          data = bytearray()
          data.extend(bytearray(text.ljust(len(self.BLOCK_ADDRS) * 16).encode('ascii')))
          i = 0
          for block_num in self.BLOCK_ADDRS:
            self.READER.MFRC522_Write(block_num, data[(i*16):(i+1)*16])
            i += 1
      self.READER.MFRC522_StopCrypto1()
      return id, text[0:(len(self.BLOCK_ADDRS) * 16)]
      
  def uid_to_num(self, uid):
      n = 0
      for i in range(0, 5):
          n = n * 256 + uid[i]
      return n

class RFID(object):
    def __init__(self, id, onId):
        print("RFID - BOOTING")
        self.reader = DeviceMFRC522(id)
        self.onId = onId
        self.lastId = 0

        id = self.reader.read_id_no_block()
        print("RFID - SETTING ID: " + str(id))
        self.onId(id)

        self.start()

    def loop(self):
        try:
            lasttime = time()
            while True:
                if time() - lasttime > (60 * 3):
                    self.lastId = 0

                id = self.reader.read_id_no_block()
                if id != self.lastId and not id is None:
                    print("RFID - UPDATING ID: " + str(id))
                    self.lastId = id
                    self.onId(id)
                    lasttime = time()

                sleep(5)

        finally:
            GPIO.cleanup()


    def start(self):
        self.t = Thread(target = self.loop)
        self.t.start()


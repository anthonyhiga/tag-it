import RPi.GPIO as GPIO
from mfrc522 import MFRC522
from threading import Thread 
from time import sleep


reader = SimpleMFRC522()

try:
  while True:
    id = reader.read_id()
    print("UPDATING ID: " + str(id))
    sleep(0.25)

finally:
  GPIO.cleanup()

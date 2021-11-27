import os, sys, traceback
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) 

from tagit.bus import MessageOutputStream, MessageBuilder 
from time import sleep

def isBusy(busy):
  print(busy)

stream = MessageOutputStream(24, isBusy)

while(True):
    sleep(5);
    message = MessageBuilder().beacon()\
                .team(0)\
                .zero()\
                .number2bit(3)\
                .toMessage()
    stream.send(message)

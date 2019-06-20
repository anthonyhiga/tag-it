from tagit import MessageOutputStream, MessageBuilder 
from time import sleep

stream = MessageOutputStream(3)

while(True):
    sleep(0.5);
    message = MessageBuilder().beacon()\
                .team(0)\
                .zero()\
                .number2bit(3)\
                .toMessage()
    stream.send(message)

from tagit import MessageOutputStream, MessageBuilder 
from time import sleep

stream = MessageOutputStream(3)
message = MessageBuilder().beacon().team(1).zero().number2bit(0).toMessage()
stream.send(message)

sleep(1)
stream.send(None)


from tagit import MessageInputStream
from signal import pause 

def onPacket(message):
    print("GOT MESSAGE: " + str(message[0]))

inputStream = MessageInputStream(2, {
    'onPacket': onPacket
})
inputStream.start()

pause()



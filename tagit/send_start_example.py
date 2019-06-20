from bus import MessageOutputStream, MessageBuilder 
from time import sleep

stream = MessageOutputStream(3)
message = MessageBuilder().packet(0x2)\
            .gameId(123)\
            .data()\
            .numberDbit(5)\
            .data()\
            .numberDbit(2)\
            .data()\
            .numberDbit(10)\
            .data()\
            .numberDbit(99)\
            .data()\
            .numberDbit(0)\
            .data()\
            .number8bit(0)\
            .data()\
            .number8bit(1)\
            .checksum()\
            .toMessage()

while(True):
    stream.send(message)
    sleep(1.5)

stream.send(None)


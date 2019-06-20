from tagit import MessageInputStream, MessageBuilder , MessageOutputStream
from signal import pause 
from time import sleep
from threading import Timer
from gpiozero import Button

class Host(object):
    def __init__(self):
        self.players = 0
        self.gameId = 123
        self.gameStatus = ''

        self.start = Button(4)
        self.start.when_pressed = self.beginGame
        self.outputStream = MessageOutputStream(3)
        self.inputStream = MessageInputStream(2, {
            'onPacket': self.onMessage
        })
        self.inputStream.start()

    def onMessage(self, message):
        print("GOT MESSAGE: " + str(message[0]))
        if (message[0] == 0x10):
            taggerId = message[2]
            team = self.players % 2

            print("RECEIVED JOIN REQUEST PLAYER: " + str(taggerId) + " PLAYER: " + str(self.players) + " TEAM: " + str(team))
             
            self.sendJoinConfirmed(taggerId, team + 1, self.players)

            self.players = self.players + 1

    def beginGame(self):
        print("STARTING GAME!!!")
        timer = Timer(1, self.startGame)
        timer.start()


    def startGame(self):
        print("TOTAL PLAYERS: " + str(self.players))
        self.gameStatus = 'RUNNING'

        # Start Countdown
        for count in range(10, -1, -1):
            sleep(1)
            print(count)
            message = MessageBuilder().packet(0x0)\
                .gameId(self.gameId)\
                .data()\
                .numberDbit(count)\
                .data()\
                .number8bit(self.players)\
                .data()\
                .number8bit(0)\
                .data()\
                .number8bit(0)\
                .checksum()\
                .toMessage()
            self.outputStream.send(message)

        while(True):
            sleep(0.5)
            print("ZONE BEACON")
            message = MessageBuilder().beacon()\
                .team(0)\
                .zero()\
                .number2bit(3)\
                .toMessage()
            self.outputStream.send(message)

    def sendJoinConfirmed(self, taggerId, team, player):
        message = MessageBuilder().packet(0x1)\
            .gameId(self.gameId)\
            .data()\
            .number8bit(taggerId)\
            .data()\
            .number8bit((team << 3) + player)\
            .checksum()\
            .toMessage()
        self.outputStream.send(message)

    def setupGame(self):
        self.gameStatus = 'SETUP'
        message = MessageBuilder().packet(0x3)\
            .gameId(self.gameId)\
            .data()\
            .numberDbit(1)\
            .data()\
            .numberDbit(1)\
            .data()\
            .numberDbit(3)\
            .data()\
            .numberDbit(0)\
            .data()\
            .numberDbit(0)\
            .data()\
            .number8bit(64)\
            .data()\
            .number8bit(74)\
            .checksum()\
            .toMessage()

        while(self.gameStatus == 'SETUP'):
            self.outputStream.send(message)
            sleep(1.5)

host = Host()
host.setupGame()
pause()



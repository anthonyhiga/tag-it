from signal import pause
from gpiozero import Button, LED
from time import sleep, monotonic
from threading import Thread

#
# Sample X times before id'ing
#
SAMPLES = 6

#
#  These are the calibrated timing values
#
IDS = [2, 6, 9, 13, 27, 63, 92]

####################
# Simple RC Circuit
#   R = 2.2k
#  C = uF  ID
####################
#    0.47   2
#    2.2    6
#    3.3    9
#    4.7   13
#    10    27
#    22    63
#    33    92
#    47   120
#   100   253
#   220   431
####################


def countPairings(n):  
    dp = [-1] * 100
      
    if(dp[n] != -1):  
        return dp[n]  
  
    if(n > 2):  
        dp[n] = (countPairings(n - 1) + 
                (n - 1) * countPairings(n - 2))  
        return dp[n] 
    else: 
        dp[n] = n  
        return dp[n] 

def totalIds():
    n = len(IDS)
    return (countPairings(n) + n - 1)

print("TOTAL POSIBLE IDS: " + str(totalIds())) 
      
 
class TimeTracker(object):
    def __init__(self, port, onId, onDisconnect):
        self.samples = []
        self.powerOn = monotonic()
        self.onId = onId
        self.onDisconnect = onDisconnect

        self.button = Button(port)
        self.button.when_pressed = self.onLight
        self.button.when_released = self.onDark

    def onLight(self):
        now = monotonic()
        diffMS = (now - self.powerOn) * 1000

        if round(diffMS) <= 1:
            self.onDisconnect()
            self.samples = []

        if len(self.samples) < SAMPLES + 2:
            self.samples.append(diffMS)

        # We only want to process the first 5 samples
        if len(self.samples) != SAMPLES: 
            return 

        # sort the samples and remove largest and smallest
        self.samples.sort()
        samples = self.samples.copy()
        samples.pop(0)
        samples.pop(-1)

        id = self.closestNumber(max(samples))
        self.onId(id)

    def onDark(self):
        now = monotonic()
        diffMS = (now - self.powerOn) * 1000

    def onPower(self):
        self.powerOn = monotonic()

    def closestNumber(self, value):
        shortestDistance = abs(1 - value) 
        closestNumber = 1
        for number in IDS:
            distance = abs(value - number)
            if (shortestDistance > distance):
                shortestDistance = distance
                closestNumber = number

        return closestNumber



class TotemPort(object):
    def __init__(self, left, right, source, onId):
        print("TOTEM PORT: " + str(left) + "," + str(right) + "," + str(source))
        self.cid = [1,1]
        self.trackerLeft = TimeTracker(left, self.onLeftId, self.onLeftDisconnect) 
        self.trackerRight = TimeTracker(right, self.onRightId, self.onRightDisconnect)
        self.power = LED(source)
        self.onId = onId
        self.lastReported = None
        self.start()

    def postId(self):
        finalCid = self.cid.copy()
        finalCid.sort()
        id = 0;
        for i in finalCid:
            id = id * 1000 + i 

        if min(self.cid) <= 1:
            id = None

        if id == self.lastReported:
            return

        self.lastReported = id
        self.onId(id)

    def onLeftDisconnect(self): 
        self.cid[0] = 1
        self.postId()
        
    def onRightDisconnect(self): 
        self.cid[1] = 1 
        self.postId()

    def onLeftId(self, id):
        self.cid[0] = id

        if min(self.cid) > 1:
            self.postId()

    def onRightId(self, id):
        self.cid[1] = id

        if min(self.cid) > 1:
            self.postId()

    def loop(self):
        while True:
            self.trackerLeft.onPower()
            self.trackerRight.onPower()
            self.power.on()
            sleep(max(IDS) / 500)
            self.trackerLeft.onPower()
            self.trackerRight.onPower()
            self.power.off()
            sleep(max(IDS) / 500)

    def start(self):
        self.t = Thread(target = self.loop)
        self.t.start()


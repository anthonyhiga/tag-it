from signal import pause
from gpiozero import Button
from time import sleep, monotonic

class TimeTracker(object):
    def __init__(self, onEdgeEvent):
        self.lastEdgeS = monotonic()
        self.onEdgeEvent = onEdgeEvent
        self.count = 0

    def onLight(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent('valley', diffNS)
        self.lastEdgeS = now
        self.count = self.count + 1

    def onDark(self):
        now = monotonic()
        diffNS = (now - self.lastEdgeS) * 1000000
        self.onEdgeEvent('rise', diffNS)
        self.lastEdgeS = now

def onEdgeEvent(direction, time):
    print("DIRECTION: " + direction + " TIME: " + str(time))

timeTracker = TimeTracker(onEdgeEvent)
button = Button(4, pull_up=False)
button.when_pressed = timeTracker.onLight
button.when_released = timeTracker.onDark

pause()

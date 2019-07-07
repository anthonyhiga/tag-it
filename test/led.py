from signal import pause
from gpiozero import LED 
from time import sleep, monotonic

led = LED(4)
led.on();

pause()

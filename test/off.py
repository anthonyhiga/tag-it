from signal import pause
from gpiozero import LED 
from time import sleep, monotonic

led1 = LED(22)
led2 = LED(17)
led3 = LED(12)
led1.off();
led2.off();
led3.off();


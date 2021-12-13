from signal import pause
from gpiozero import LED 
from time import sleep, monotonic

led1 = LED(22)
led2 = LED(17)
led3 = LED(12)
while True:
  led1.on();
  led2.on();
  led3.on();
  sleep(1);
  led1.off();
  led2.off();
  led3.off();
  sleep(1);

pause()

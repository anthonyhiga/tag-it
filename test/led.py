from signal import pause
from gpiozero import LED 
from time import sleep, monotonic

led = LED(17)
while True:
  led.on();
  sleep(1);
  led.off();
  sleep(1);

pause()

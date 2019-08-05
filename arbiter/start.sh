#!/usr/bin/sh

sudo killall pigpiod
sudo pigpiod
python3 main.py

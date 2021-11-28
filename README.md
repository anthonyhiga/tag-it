Project Tag-It

# Overview
This project is a raspberry pi driven code base which allows one to setup Lazer Tag games based on the Hasbro Lazer Tag Team Ops line of Guns.

These guns are currently out of production, but are surprisingly full featured if you have a orchestration software to manage games run on these devices.

Don't bother trying this project out if you don't already have some electronics experience.

The work was based on the wonderful reference doc:
https://wiki.lazerswarm.com/wiki/Main_Page


# Components
## Overmind
The Overmind is the central controller for the entire system.  It is a local http service which coordinates all of the actions of the various components.

It manages the games
Manages the users

## Arbiter
The Arbiter is the raspberry pi service which manages the underlying communication with the Raspberry PI GPIO.  It is responsible for the details
on sending and receiving messages from the Lazer Tag Guns

## Referee
The Referee is a web ui which allows administrators to start and manage games

## TagIt
The tag it library is the detailed GPIO messaging library.  It contains all of the IR protcols and GPIO interface code.

## RfID
The RFID library manages the RFID scanner 


# Hardware
Raspberry PI 3 or better

IR Receiver Circut
IR Trasmitter Circut
5v to 3.3v bi-directional converter
RFID-RC522 Sensor
RFID stickers or keys to map to your guns


NOTES:
Don't forget to enable the SPI features on your device

Raspberry PI Configuration -> Enable SPI


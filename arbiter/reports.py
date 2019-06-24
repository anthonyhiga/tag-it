import sys, traceback
from network import getSocket, serialNumber
from signal import pause 
from time import sleep
from threading import Thread

def subscribeReportCheckList(updateList):
    def callback(_id, data):
      try:
        checkList = data['payload']['data']['report_check_list']
        updateList(checkList)

      except:
        print("ERROR: Unable to register arbiter with overmind")
        print("Unexpected error:", sys.exc_info()[0])


    def monitor():
      while(True):
        print("Connecting to Overmind")
        try:
          ws = getSocket()
          query = """
          subscription {
            report_check_list {
              gameId
              ltGameId
              ltTeamId
              ltPlayerId
              ltTagTeamId
              type
              status
            }
          }
          """
          ws.subscribe(query, variables={}, callback=callback)

          print("Connected to Overmind")

          # block this thread and do nothing unless the connection
          # is lost
          while(True):
            if (not ws.is_running()):
              print("Lost Connection to Overmind")
              break
            sleep(1)

        except:
          print("ERROR: Unable to talk with overmind")

        # retry every 20 seconds
        sleep(10)

    thread = Thread(target=monitor)
    thread.start()


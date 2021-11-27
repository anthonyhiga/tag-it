import sys, traceback
from network import getSocket, serialNumber
from signal import pause 
from time import sleep
from threading import Thread

def subscribeReportCheckList(updateList):
    def callback(_id, data):
      try:
        checkList = data['payload']['data']['report_check_list']['items']
        updateList(checkList)

      except:
        print("ERROR: Unable to register arbiter with overmind")
        print("Unexpected error:", sys.exc_info()[0])


    def monitor():
      sleep(4)
      while(True):
        print("Reports - Connecting to Overmind")
        ws = None
        try:
          ws = getSocket()
          query = """
          subscription ReportsCheckList {
            report_check_list {
              id 
              items {
                gameId
                ltGameId
                ltTeamId
                ltPlayerId
                ltTagTeamId
                type
                status
              }
            }
          }
          """
          ws.subscribe(query, variables={}, callback=callback)

          print("Reports - Connected to Overmind")

          # block this thread and do nothing unless the connection
          # is lost
          while(True):
            # we are reaching into the underlying implementation here.
            # this is cause the graphql library doesn't have an api
            # to see if it's died or not.
            if not ws._connection.connected:
              raise Exception("Reports - Lost connection with Overmind");
            sleep(1)

        except:
          print("ERROR: Unable to report to overmind, is it online?")

        finally:
          if ws != None:
            ws.close()

        # retry every 5 seconds
        sleep(5)

        print("Reports - Re-connecting to Overmind")

    thread = Thread(target=monitor)
    thread.start()


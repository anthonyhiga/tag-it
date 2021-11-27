import sys, traceback
from network import getSocket, serialNumber
from signal import pause 
from time import sleep
from threading import Thread

#
# NOTE: it is intentional that we only have one zone per arbiter
#     While it is possible to have the arbiter control multiple
#     emitters, which indeed it will for some situations,
#     having multiple zone control would make game configuration harder
#     and also we want to avoid laying tons of wiring just to save on
#     15 dollars of additional hardware.
#

commandHistory = []

def markCommandComplete(id):
    try:
        ws = getSocket()
        query = """
        mutation RespondArbiterCommand($id: ID!) {
          respond_arbiter_command(id: $id, status: COMPLETE) {
            id
            status
          }
        }
        """
        result = ws.query(query, variables={'id': id})

    except:
        print("ERROR: markCommandComplete - Unable talk to overmind")
        print("Unexpected error:", sys.exc_info()[0])

def markCommandFailed(id):
    try:
        ws = getSocket()
        query = """
        mutation RespondArbiterCommand($id: ID!) {
          respond_arbiter_command(id: $id, status: FAILED) {
            id
            status
          }
        }
        """
        ws.query(query, variables={'id': id})

    except:
        print("ERROR: markCommandFailed - Unable talk to overmind")
        print("Unexpected error:", sys.exc_info()[0])

def markCommandRunning(id):
    try:
        ws = getSocket()
        query = """
        mutation RespondArbiterCommand($id: ID!) {
          respond_arbiter_command(id: $id, status: RUNNING) {
            id
            status
          }
        }
        """
        ws.query(query, variables={'id': id})

    except:
        print("ERROR: marCommandRunning - Unable talk to overmind")
        print("Unexpected error:", sys.exc_info()[0])


def subscribeCommands(runCommand, onReconnected):
    def callback(_id, data):
      # format:
      # {'id': 'lgpFHp', 'type': 'data', 'payload': {'data': {'arbiter_active_commands': [{'status': 'START', 'id': '2', 'message': 'hello world'}]}}}
      try:
        commands = data['payload']['data']['arbiter_active_commands']
        for command in commands:
          id = command['id']
          if id in commandHistory:
            continue
          if command['status'] == 'RUNNING':
            continue

          commandHistory.append(id)
          if len(commandHistory) > 20:
              commandHistory.pop(0)

          markCommandRunning(id)
          print("RUNNING COMMAND: " + str(id))
          try:
            runCommand(command['message'])
            print("COMMAND DONE: " + str(id))
            markCommandComplete(id)
          except:
            print("COMMAND FAILED: " + str(id))
            print("Unexpected error:", sys.exc_info()[0])
            traceback.print_tb(sys.exc_info()[2])
            markCommandFailed(id)


      except:
        print("ERROR: Unable to register arbiter with overmind")
        print("Unexpected error:", sys.exc_info()[0])


    def monitor():
      sleep(2)
      print("Command - Connecting to Overmind")
      while(True):
        ws = None
        try:
          ws = getSocket()
          query = """
          subscription ArbiterActiveCommands($id: ID!) {
            arbiter_active_commands(id: $id) {
              id
              status
              message
            }
          }
          """
          ws.subscribe(query,\
            variables={'id': serialNumber},\
            callback=callback)

          onReconnected()
          print("Command - Connected to Overmind")

          # block this thread and do nothing unless the connection
          # is lost
          while(True):
            # we are reaching into the underlying implementation here.
            # this is cause the graphql library doesn't have an api
            # to see if it's died or not.
            if not ws._connection.connected:
              raise Exception("Command - Connection Lost");
            sleep(1)

        except:
          print("ERROR: Unable to talk with overmind, is it online?")

        finally:
          if ws != None:
            ws.close()

        # retry every 5 seconds
        sleep(5)

        print("Command - Re-connecting to Overmind")

    thread = Thread(target=monitor)
    thread.start()


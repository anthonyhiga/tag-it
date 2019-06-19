import sys 
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

commandHistory = {}

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
        ws.query(query, variables={'id': id})
        del commandHistory[id]

    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to register arbiter with overmind")

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
        del commandHistory[id]

    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to register arbiter with overmind")

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
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to register arbiter with overmind")


def subscribeCommands(runCommand):
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

          commandHistory[id] = command
          markCommandRunning(id)
          print("RUNNING COMMAND: " + str(id))
          try:
            runCommand(command['message'])
            print("COMMAND DONE: " + str(id))
            markCommandComplete(id)
          except:
            markCommandFailed(id)

      except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to register arbiter with overmind")


    def monitor():
      while(True):
        print("Connecting to Overmind")
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

          print("Connected to Overmind")

          # block this thread and do nothing unless the connection
          # is lost
          while(True):
            if (not ws.is_running()):
              print("Lost Connection to Overmind")
              break
            sleep(1)

        except:
          type, value, traceback = sys.exc_info()
          print('Error opening %s: %s' % (value.filename, value.strerror))
          print("ERROR: Unable to register arbiter with overmind")

        # retry every 20 seconds
        sleep(10)

    thread = Thread(target=monitor)
    thread.start()


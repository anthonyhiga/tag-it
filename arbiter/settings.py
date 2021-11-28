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

def callback(_id, data):
  print(id)
  print(data)

def updateChannel(name, totemId, status, type):
    try:
        ws = getSocket()
        query = """
        mutation update_arbiter_channel($arbiterId: ID!, $name: String!,
          $type: ArbiterChannelType, $status: ArbiterChannelStatus, $totemId: ID) {
          update_arbiter_channel(arbiterId: $arbiterId, name: $name, type: $type,
            status: $status, totemId: $totemId) {
            id
          }
        }
        """
        
        ws.query(query, variables={
            'arbiterId': serialNumber,
            'name': name,
            'totemId': totemId,
            'status': status,
            'type': type,
            } )
    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to update channel with overmind")


def registerArbiter():
    try:
        ws = getSocket()
        query = """
        mutation register_arbiter_settings($id: ID!) {
          register_arbiter_settings(id: $id) {
            id
            zoneType 
          }
        }
        """
        
        ws.query(query, variables={'id': serialNumber})
    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Unable to register arbiter with overmind")

def subscribeSettings():
    def monitor():
      while(True):
        print("Settings - Connecting to Overmind")
        ws = None
        try:
          ws = getSocket()
          query = """
          subscription ArbiterSettingsUpdated($id: ID!) {
            arbiter_settings_updated(id: $id) {
              id
              zoneType
            }
          }
          """
          ws.subscribe(query,\
            variables={'id': serialNumber},\
            callback=callback)

          print("Settings - Connected to Overmind")

          # block this thread and do nothing unless the connection
          # is lost
          while(True):
            # we are reaching into the underlying implementation here.
            # this is cause the graphql library doesn't have an api
            # to see if it's died or not.
            if not ws._connection.connected:
              raise Exception("Settings - Lost connection with Overmind");
            sleep(1)

        except:
          print("ERROR: Unable get settings from overmind, is it online?")

        finally:
          if ws != None:
            ws.close()

        # retry every 5 seconds
        sleep(5)

        print("Settings - Re-connecting to Overmind")

    thread = Thread(target=monitor)
    thread.start()


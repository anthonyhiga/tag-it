#
#  Write up library which auto finds via broadcast the current Overmind
#

from graphql_client import GraphQLClient

def getSocket():
  return GraphQLClient('ws://localhost:4000/graphql') 

def _getSerialNumber():
  # Extract serial from cpuinfo file
  cpuserial = "0000000000000000"
  try:
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()
  except:
    cpuserial = "ERROR000000000" 

  return cpuserial

#
# Cache this value locally since we only need it once 
#
serialNumber = _getSerialNumber()
print("ARBITER ID: " + serialNumber)

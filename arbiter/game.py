import sys 
from network import getSocket, serialNumber
from signal import pause 

def joinedPlayer(id, totemId):
    try:
        ws = getSocket()
        query = """
        mutation joined_player($id: ID!, $totemId: ID) {
          joined_player(id: $id, totemId: $totemId) {
            id
          }
        }
        """
        
        result = ws.query(query, variables={
            'id': id,
            'totemId': totemId,
            })
    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Joined Player - Unable to update channel with overmind")

def fileBasicReport(report):
    try:
        ws = getSocket()
        query = """
        mutation file_basic_tag_report($report: BasicTagReportInput!) {
          file_basic_tag_report(report: $report) {
            id
          }
        }
        """
        
        result = ws.query(query, variables={
            'report': report,
            })
    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Basic Report - Unable to update channel with overmind")

def fileTeamReport(report):
    try:
        ws = getSocket()
        query = """
        mutation file_team_tag_report($report: TeamTagReportInput!) {
          file_team_tag_report(report: $report) {
            id
          }
        }
        """
        
        result = ws.query(query, variables={
            'report': report,
            })
    except:
        type, value, traceback = sys.exc_info()
        print('Error opening %s: %s' % (value.filename, value.strerror))
        print("ERROR: Team Report - Unable to update channel with overmind")


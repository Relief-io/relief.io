import bson
import pprint
import pymongo
import sys


#please enter the username , pwd to the database you are connecting to on object rocket
# this will connect you to the database

username = ""
pwd = ""
database = ""

db = 'mongodb://'+username+':'+pwd+'@ord-mongos0.objectrocket.com:10857/'+database+'?w=1'

#

try:
	connection = pymongo.Connection(db)
	db = connection[database]

except Exception, ex:
	print "Couldnt connect , exception is : %s" %ex
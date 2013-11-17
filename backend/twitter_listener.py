#(https://github.com/geduldig/TwitterAPI)
from TwitterAPI import TwitterAPI

import os, threading, utils
from bson.binary import Binary
import zlib, pymongo, json, base64

###Settings code###
#uncomment when working locally; provide settings.py file; see sample settings.py
#import settings 

#uncomment when working remotely. set remoteloc to folder containing settings.py outside of github
###Server code###
import imp
rootloc=''
settings = imp.load_source('settings', rootloc+'/settings.py')
###End of Settings code###

class TwitterListener:
	def __init__(self):
		self.listeners = []
		self.twitter = TwitterAPI(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, settings.ACCESS_TOKEN, settings.ACCESS_TOKEN_SECRET)

	def register(self, listener, *args):
		self.listeners.append((listener,args))

	def run(self):
		req = self.twitter.request('statuses/filter',{'track':settings.TOPICS})
		for tweet in req.get_iterator():
			for listener,args in self.listeners:
				listener(tweet, args)
	def start(self):
		thread = threading.Thread(target = self.run)
                thread.start()

def mongo_store(tweet, tbl):
   tbl.insert({'data':Binary(base64.b64encode(zlib.compress(json.dumps(tweet))))})


if __name__ == "__main__":

   conn = pymongo.MongoClient('mongodb://'+settings.MONGO_USER+':'+settings.MONGO_PWD+'@'+settings.MONGO_HOST+':'+settings.MONGO_PORT+'/'+settings.MONGO_DB)
   tbl = conn[settings.MONGO_DB]['tweets']

	t = TwitterListener()
   t.register(mongo_store, tbl)
	t.start()

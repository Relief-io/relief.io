import pymongo, json
from os import listdir

from os.path import isfile, join, isdir
username=''
password=''

db = 'mongodb://'+username+':'+password+'@ord-mongos0.objectrocket.com:10857/reliefprod1?w=1'
conn = pymongo.MongoClient(db)
regions = conn['reliefprod1']['regions']

dirs = [ f for f in listdir("./") if isdir(join("./",f)) ]
for dir in dirs:
   geojson = ""
   topojson = ""
   region = dir
   files = [ f for f in listdir("./"+dir) if isfile(join("./"+dir,f)) and f[-4:]=='json']
   for file in files:
      if file[-7:] =='geojson':
         print join("./"+dir,file)
         content = open(join("./"+dir,file))
         geojson = content.read()
         content.close()
      else:
         print join("./"+dir,file)
         content = open(join("./"+dir,file))
         topojson = content.read()         
         content.close()
   data = {'region':region,'geojson':geojson,'topojson':topojson}
   regions.insert(data)      


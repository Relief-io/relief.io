##Organizations:
	Organization:
		name: String
		active: Bool
		regions: Array
		Services: Array
		url: String
		donations: Number
		groups: Array

	 Organizations can list where their workers or groups of workers are located. 
     Should I'm guessing this should be another query to a groups collection?

##Groups:
	Group:
		organization: ObjectID
		workers: Array
		region: String
		address: String
		loc: Array

##Suvivors:
	Survivor:
		name: String
		region: String
		address: String
		loc: Array
		found: Bool
		donations: Number

##Volunteers:
	Volunteer:
		name: String
		active: Bool
		region: String
		address: String
		loc: Array

##Reports:
	Report:
		loc: Array
		type:
       
	   Type corresponds to what is reported 
	   Damage / Need / anything. This is open-ended reporting and is cleaned, sorted, and categorized automatically


#Shelters:
	Shelter:
		name: String
		active: Bool
		region: String
		address: String
		loc: Array
		donations: Number

#Foods:
	Food:
		name: String
		region: String
		address: String
		loc: Array
		donations: Number

#Medical:
	name: String
	region: String
	address: String
	loc: Array
	type: Array

#Regions
	Region: String
	geo: Polygon

	Can contain any type

#Tweets
	Tweet: String
    Tags : String
	Location_Terms : String
	Important_words : String
	Time : Timestamp
    Date : Date
    
	Comments:
	
	>Here i have mentioned the use of tags which implies we store the hashtags separately
	>Location Terms implies that if some locations have been mentioned in the tweets
	we grep for them in the tweet and store them separately , this will help us search faster.
	>Important words refers to words like emergency, relief , aid and other important terms that have been mentioned in the tweets that are separately grep'd so that we can search faster 


	

#Comments
	Every type has an Area attribute.
	
	Reason for separating Region, Address, and Location is do to querying and information given. If a region is listed, there is no need to search the Location against the Region collection. A Location attribute is for map display.
	
	I don't think we should store objects within each Region. Once the object type is queried against and placed within a region, it will become listed within its attribute. So there will only be 17 documents (objects) within the Regions collection. We can then create an index on each region attribute on every object.


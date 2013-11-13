	var	mongo = require('mongoskin')
,	config = require('../../config')
,	dbAddress = config['mongo.host'] + ':' + config['mongo.port'] + '/' + config['mongo.name']
,	db = mongo.db( dbAddress , {safe:true});

db.bind('organizations');

var organization = {
	_id: ObjectId,
	name: 
	active: true,
	regions: [],

}

app.get('/organizations', function(req, res, next){

	db.organizations.find({active: true},{limit: 3}).toArray(function(err,docs){
		if (err) throw err;
		//console.log(docs);

		var returnOrgs = docs;
		console.log("organizations = ", returnOrgs);

	});

});

app.get('/organizations/:organizationName', function(req, res) {
  db.organizations.find({},{limit:10, sort: [['_id',-1]]}).toArray(function(e, docs){
    if (e) return next(e)
    res.send(docs)
  })
})

app.post('/organizations/:organizationName', function(req, res) {
  db.organizations.insert(req.body, {}, function(e, docs){
    if (e) return next(e)
    res.send(docs)
  })
})

app.get('/organizations/:organizationName/:id', function(req, res) {
  db.organizations.findOne({_id: db.organizations.id(req.params.id)}, function(e, doc){
    if (e) return next(e)
    res.send(doc)
  })
})

app.put('/organizations/:organizationName/:id', function(req, res) {
  db.organizations.update({_id: db.organizations.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, doc){
    if (e) return next(e)
    res.send((doc===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/organizations/:organizationName/:id', function(req, res) {
  db.organizations.remove({_id: db.organizations.id(req.params.id)}, function(e, doc){
    if (e) return next(e)
    res.send((doc===1)?{msg:'success'}:{msg:'error'})
  })
})

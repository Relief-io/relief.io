	var	mongo = require('mongoskin')
,	config = require('../../config')
,	dbAddress = config['mongo.host'] + ':' + config['mongo.port'] + '/' + config['mongo.name']
,	db = mongo.db( dbAddress , {safe:true});

db.bind('organizations');

/*
var organization = {
	_id: ObjectId,
	name: 'Default Organization Name',
	active: true,
	regions: ['r1','r3','r5'],
	services: ['food','shelter','medical']
}
*/

/* Use this in Mongo shell for test info
db.organizations.insert({ name: 'The Philippine Red Cross', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.redcross.org.ph/'})
db.organizations.insert({ name: 'UNICEF', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://secure.unicefusa.org/site/Donation2?df_id=16500&16500.donation=form1'})
db.organizations.insert({ name: 'World Food Programme (WFP)', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://secure2.convio.net/fwfp/site/Donation2;jsessionid=6567FE8838700712A5C7325B5C0F13DA.app261a?idb=1237175804&df_id=2141&2141.donation=form1&2141_donation=form1'})
db.organizations.insert({ name: 'The International Rescue Commitee (IRC)', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.rescue.org/'})
db.organizations.insert({ name: 'Médecins Sans Frontières', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://www.doctorswithoutborders.org/donate/onetime.cfm?source=AZD130000S02&q=brand_C_FR_Doctors&source=AZD130000S02&gclid=COektOOr4LoCFTBnOgodZHYASw&mpch=ads'})
db.organizations.insert({ name: 'Save the Children', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://secure.savethechildren.org/site/c.8rKLIXMGIpI4E/b.8855857/k.E53D/Donate_to_the_Typhoon_Haiyan_Childrens_Relief_Fund/apps/ka/sd/donor.asp'})
db.organizations.insert({ name: 'Catholic Relief Services', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://emergencies.crs.org/typhoon-haiyan-help-philippines-survive-and-recover/'})
db.organizations.insert({ name: 'World Vision', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://donate.worldvision.org/OA_HTML/xxwv2ibeCCtpItmDspRte.jsp?funnel=dn&item=2639566&go=item&section=10339&'})
db.organizations.insert({ name: 'Habibtat for Humanity', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.give2habitat.org/philippines/ReBuildPhilippines'})
db.organizations.insert({ name: 'Operation USA', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.opusa.org/bulletin-operation-usa-preparing-to-aid-recovery-efforts-in-the-philippines-following-typhoon/'})
db.organizations.insert({ name: 'National Alliance for Filipino Concerns (NAFCON)', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://nafconusa.org/2013/10/nafcon-reactivates-bayanihan-disaster-relief-and-rehabilitation-campaign/'})
db.organizations.insert({ name: 'The American Jewish Joint Distribution Committee', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://secure3.convio.net/jdc/site/Donation2;jsessionid=178A8644AC0B5C0D7F9C65C63D95DFA3.app332a?df_id=2741&2741.donation=form1'})
db.organizations.insert({ name: 'Mercy Corps', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://www.mercycorps.org/donate/help-typhoon-haiyan-survivors-hpsl'})
db.organizations.insert({ name: 'ChildFund International', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.childfund.org/emergency/'})
db.organizations.insert({ name: 'International Medical Corps', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://internationalmedicalcorps.org/sslpage.aspx?pid=183#.UoFIcvmkrAg'})
db.organizations.insert({ name: 'The Salvation Army', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://salvationarmyusa.org/'})
db.organizations.insert({ name: 'Direct Relief', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.directrelief.org/'})
db.organizations.insert({ name: 'Oxfam', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'https://secure.oxfamamerica.org/site/Donation2?8300.donation=form1&df_id=8300'})
db.organizations.insert({ name: 'Team Rubicon', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://teamrubiconusa.org/launching-operation-seabird/'})
db.organizations.insert({ name: 'Action Against Hunger', active: true, regions: ['r1','r3','r5'], services: ['food','shelter','medical'], url: 'http://www.actionagainsthunger.org/about'})
*/

app.get('/organizations', function(req, res, next){

	db.organizations.find({active: true},{limit: 3}).toArray(function(err,docs){
		if (err) throw err;
		//console.log(docs);

		var returnOrgs = docs;
		console.log("organizations = ", returnOrgs);

	});

});

/*
app.get('/organizations/:organizationName', function(req, res) {
  db.organizations.find({},{limit:10, sort: [['_id',-1]]}).toArray(function(e, docs){
    if (e) return next(e)
    res.send(docs)
  })
})
*/

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

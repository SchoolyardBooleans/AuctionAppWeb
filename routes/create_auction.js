var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var router = express.Router();

/* GET the create auction page */
router.get('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});
	
	var dustVars = {
		title: 'Create Auction',
		cssFiles: [
			{css: 'create_auction.css'},
			{css: 'formValidation.min.css'},
			{css: 'bootstrap-datetimepicker.min.css'}
		],
		javascriptFiles: [
			{javascript: 'bootstrap-datetimepicker.min.js'},
			{javascript: 'formValidation.min.js'},
			{javascript: 'formValidation-bootstrap.min.js'},
			{javascript: 'create_auction.js'}
		],
		auctionVenues: []
	};

	//	get List of auction locations
	/*Get List of sponsors */
	conn.query("SELECT Id, Name FROM bidfresh__Auction_Venue__c ORDER BY Name ASC")
	.on("record", function(record) {
		console.log('Name : ' + record.Name  + ', Id: ' + record.Id);
		var new_entry = {id: record.Id, name: record.Name}
		
		dustVars.auctionVenues.push(new_entry);
	})
   .on("end", function(query) {
		dustVars.auctionVenues[0].isSelected = "selected";

		res.render('create_auction', dustVars);
	}).on("error", function(err) {
		console.log("query error" + err);
	}).run(); 
	
});

function createNewAuction(request) {
	var start_date = new Date(request.body.start_date).toISOString(),
		end_date = new Date(request.body.end_date).toISOString();

	var auction = {
		name : request.body.name,
		bidfresh__Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		bidfresh__Start_Time__c : start_date,
		bidfresh__End_Time__c : end_date,
		bidfresh__Location__c : request.body.location_picklist
	}

	return auction;
}

router.createNewAuction = createNewAuction;

/* POST created auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var newAuction = createNewAuction(req);

	conn.sobject('bidfresh__Auction__c').create(newAuction, function(err, ret) {
		if (err || !ret.success) {
			res.status(500).end();
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.status(200).end();
	});

});



module.exports = router;

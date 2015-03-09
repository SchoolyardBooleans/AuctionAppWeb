var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var router = express.Router();

/* GET the create auction page */
router.get('/', function(req, res) {
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
		]
	};
	res.render('create_auction', dustVars);
});

/* POST created auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var start_date = new Date(req.body.start_date).toISOString(),
		end_date = new Date(req.body.end_date).toISOString();

	/*Still need to add on a location AND Hosting_Nonprofit__C won't be hardcoded in future*/
	var auction = {
		Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		name : req.body.name,
		Start_Time__c : start_date,
		End_Time__c : end_date,
		Location__c : req.body.auction_location
	}

	conn.sobject('Auction__c').create(auction, function(err, ret) {
		if (err || !ret.success) {
			res.status(500).end();
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.status(200).end();
	});

});



module.exports = router;

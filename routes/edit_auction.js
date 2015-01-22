var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var moment = require('moment');
var router = express.Router();

/* GET the edit auction page */
router.get('/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	conn.sobject('Auction__c').retrieve(req.params.id, function(err, auction) {
	 	if (err) {
	 		return console.error(err);
	 	}

	 	var start_str = moment(auction.Start_Time__c).format('MM/DD/YYYY hh:SS A');
	 	var end_str = moment(auction.End_Time__c).format('MM/DD/YYYY hh:SS A');


		/*still needs auction location*/
		var dustVars = {
			title: 'Edit Auction',
			auction_name: auction.Name,
			auction_start_date: start_str,
			auction_end_date: end_str,
			cssFiles: [
				{css: 'edit_auction.css'},
				{css: 'formValidation.min.css'},
				{css: 'bootstrap-datetimepicker.min.css'}
			],
			javascriptFiles: [
				{javascript: 'bootstrap-datetimepicker.min.js'},
				{javascript: 'formValidation.min.js'},
				{javascript: 'edit_auction.js'}
			]
		};

		res.render('edit_auction', dustVars);
	});
});

/* POST edited auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var start_date = new Date(req.body.start_date).toISOString(),
		end_date = new Date(req.body.end_date).toISOString();

	/*Still need to add on a location*/
	var auction = {
		Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		name : req.body.name,
		Start_Time__c : start_date,
		End_Time__c : end_date
	}

	conn.sobject('Auction__c').create(auction, function(err, ret) {
		if (err || !ret.success) {
			res.status(406).end();
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.status(200).end();
	});

});



module.exports = router;
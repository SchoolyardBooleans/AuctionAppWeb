var express = require('express');
var jsforce = require('jsforce');
var router = express.Router();
var request = require('request');
var jsforce = require('jsforce');
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var dustVars = {
    	title: 'Auction App',
    	cssFiles: [{css: 'index.css'}],
    	javascriptFiles: [{javascript: 'index.js'}],
    	auctions: []
    }

    //regexp replace str: ([\s,.])([_A-Za-z]+__[cr])

	var query_str = "SELECT Id, Name, bidfresh__Status__c, bidfresh__Start_Time__c, bidfresh__Location__r.Name" + 
		" FROM bidfresh__Auction__c ORDER BY bidfresh__Status__c ASC";
	//"SELECT Id, Name FROM bidfresh__Sponsor__c"	
	/*Get List of Auctions */
	conn.query(query_str)
	.on("record", function(record) {
		console.log("start time: " + record.bidfresh__Start_Time__c);
		var status_str = "Upcoming";
		var auction_base_url = "edit_auction";

		if(record.bidfresh__Status__c == 1) {
			status_str = "In Progress";
			auction_base_url = "auction_in_progress/" + record.Name;
		}
		else if(record.bidfresh__Status__c == 2) {
			status_str = "Complete";
			auction_base_url = "auction_summary";
		}
			
		dustVars.auctions.push({
			Id: record.Id,
			Name: record.Name,
			Location: record.bidfresh__Location__r == null ? null : record.bidfresh__Location__r.Name,
			Start_Time: moment(record.bidfresh__Start_Time__c).format('MM/DD/YYYY hh:mm A'),
        	//End_Time: moment(record.End_Time).format('MM/DD/YYYY hh:SS A')
        	Status: status_str,
        	auction_base_url: auction_base_url
 		});

	})
   .on("end", function(query) {
   		//moved here from end of callback

   		res.render('index', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		var errVars = {
			message: 'Query error, make sure your salesforce organization has the bidfresh app installed.',
			error: err
		};
		res.render('error', errVars);
   	}).run();
   	//TODO: sort record traversal based on date/status
});

router.delete('/delete_auction/:id', function(req, res) {
	var auction_id = req.params.id;
	console.log("auction id to delete is: " + auction_id);

	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	conn.sobject("bidfresh__Auction__c").destroy(auction_id, function(err, ret) {
  		if(err || !ret.success) {
  			console.error(err, ret);
  			res.status(500).end();
  		}
  		else {
  			console.log('Deleted Successfully : ' + ret.id);
  			res.status(200).end();
  		}
	});
});



module.exports = router;

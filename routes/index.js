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

	var query_str = "SELECT Id, Name, Status__c, Start_Time__c, Location__r.Name" + 
		" FROM Auction__c ORDER BY Status__c ASC";
	//"SELECT Id, Name FROM Sponsor__c"	
	/*Get List of Auctions */
	conn.query(query_str)
	.on("record", function(record) {
		console.log("start time: " + record.Start_Time__c);
		var status_str = "Upcoming";
		var auction_base_url = "edit_auction";

		if(record.Status__c == 1) {
			status_str = "In Progress";
			auction_base_url = "auction_in_progress/" + record.Name;
		}
		else if(record.Status__c == 2) {
			status_str = "Complete";
			auction_base_url = "auction_summary";
		}
			
		dustVars.auctions.push({
			Id: record.Id,
			Name: record.Name,
			Location: record.Location__r == null ? null : record.Location__r.Name,
			Start_Time: moment(record.Start_Time__c).format('MM/DD/YYYY hh:mm A'),
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
		res.render('index', dustVars);
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

	conn.sobject("Auction__c").destroy(auction_id, function(err, ret) {
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

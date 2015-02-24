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

	// var query_str = "SELECT Id FROM Auction__c WHERE Hosting_Nonprofit__c = 'a0Zj0000000eDTTEA2'";

	// conn.query(query_str, function(err, result) {
	// 	if (err) {
	// 		return console.error(err);
	// 	}

 //  		console.log("total : " + result.totalSize);
 //  		console.log("fetched : " + result.records.length);

 //  		var dustVars = {
	// 		title: 'Auction App',
	// 		cssFiles: [{css: 'index.css'}],
	// 		javascriptFiles: [{javascript: 'index.js'}],
	//     }

	// 	res.render('index', dustVars);
	// });

	var dustVars = {
    	title: 'Auction App',
    	cssFiles: [{css: 'index.css'}],
    	javascriptFiles: [{javascript: 'index.js'}],
    	auctions: []
    }

	var query_str = "SELECT Id, Name, Status__c, Start_Time__c, End_Time__c, Location__r.Name" + 
		" FROM Auction__c";
	//"SELECT Id, Name FROM Sponsor__c"	
	/*Get List of Auctions */
	conn.query(query_str)
	.on("record", function(record) {
		
		console.log('record body: ' + JSON.stringify(record));
			
		dustVars.auctions.push({
			Id: record.Id,
			Name: record.Name,
			Location: record.Location__r == null ? null : record.Location__r.Name,
			Start_Time: moment(record.Start_Time).format('MM/DD/YYYY hh:SS A'),
        	End_Time: moment(record.End_Time).format('MM/DD/YYYY hh:SS A')
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



module.exports = router;

var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');

/* GET users listing. */
router.get('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var dustVars = {
    	title: 'View Donors',
    	cssFiles: [{css: 'donors.css'}],
    	donors: []
    }

	var query_str = "SELECT Name, lastName__c FROM Bidder_Account__c";

	/*Get List of Donors */
	conn.query(query_str)
	.on("record", function(donor) {
		console.log("Donor: " + util.inspect(donor, false, null));
		dustVars.donors.push(donor);
	})
   .on("end", function(query) {
   		res.render('donors', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('donors', dustVars);
   	}).run();
});

module.exports = router;
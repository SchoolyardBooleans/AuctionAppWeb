var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');

/* GET users listing. */
router.get('/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var dustVars = {
    	title: 'Auction Summary'
    }

	var query_str = "SELECT Name FROM Auction__C WHERE Id = '" + req.params.id + "'";

	/*Get List of Donors */
	conn.query(query_str)
	.on("record", function(auction) {
		console.log("Auction: " + util.inspect(auction, false, null));
		dustVars.Name = auction.Name
	})
   .on("end", function(query) {
   		res.render('auction_finished', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('auction_finished', dustVars);
   	}).run();
});

module.exports = router;
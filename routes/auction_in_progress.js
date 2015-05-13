var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');

/* GET a finished auction*/
router.get('/:auction_name/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var auctionId = req.params.id;

	var dustVars = {
    	title: 'Auction Summary',
    	cssFiles: [{css: 'auction_in_progress.css'}],
    	javascriptFiles: [
    		{javascript: 'auction_in_progress.js'}
    	],
    	auction_name: req.params.auction_name,
    	bids: []
    }

	var query_str = "SELECT bidfresh__Amount__c, bidfresh__Auction_Item__r.Name, bidfresh__Bidder_Account__r.Name FROM " + 
					"bidfresh__Bid__c WHERE bidfresh__Auction_Item__r.bidfresh__Auction__c = '" + auctionId + "' " + 
					"ORDER BY CreatedDate DESC";

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(bid) {
		console.log("Bid: " + util.inspect(bid, false, null));
		var temp_bid = {
			amount : bid.bidfresh__Amount__c,
			bidder_name : bid.bidfresh__Bidder_Account__r.Name,
			item_name : bid.bidfresh__Auction_Item__r.Name
		}

		dustVars.bids.push(temp_bid);

	})
   .on("end", function(query) {
   		res.render('auction_in_progress', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.status(500).end()
		// res.render('auction_finished', dustVars);
   	}).run();
});

module.exports = router;
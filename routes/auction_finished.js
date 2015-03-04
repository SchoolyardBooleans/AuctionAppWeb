var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');

/* GET a finished auction*/
router.get('/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var dustVars = {
    	title: 'Auction Summary',
    	cssFiles: [{css: 'auction_finished.css'}],
    	javascriptFiles: [{javascript: 'auction_finished.js'}]
    }

	var query_str = "SELECT Name, (SELECT Name, Id, Current_Bid__c, Winning_Bidder__c FROM Auction_Items__r) " +
					"FROM Auction__C WHERE Id = '" + req.params.id + "'";

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(auction) {
		console.log("Auction: " + util.inspect(auction, false, null));
		dustVars.name = auction.Name;
		dustVars.auction_id = req.params.id;
		dustVars.auction_items = [];
		if(auction.Auction_Items__r) {
			auction.Auction_Items__r.records.forEach(function(item) {
				dustVars.auction_items.push(item);
			});
		}
	})
   .on("end", function(query) {
   		res.render('auction_finished', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('auction_finished', dustVars);
   	}).run();
});

/*GET a finished auction item*/
router.get('/:auction_id/item_summary/:item_id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var dustVars = {
    	title: 'Item Summary',
    	cssFiles: [{css: 'item_finished.css'}],
    	javascriptFiles: [{javascript: 'item_finished.js'}]
    }

    var query_str = "SELECT Current_Bid__c, Description__c, Id, Image_URL__c, Name, Payment_Verified__c " +
    				"FROM Auction_Item__c WHERE Id = '" + req.params.item_id + "'";

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(item) {
		console.log("Item: " + util.inspect(item, false, null));
		dustVars.name = item.Name;
		dustVars.item_id = req.params.id;
		dustVars.description = item.Description__c;
		dustVars.payment_verified = item.Payment_Verified__c;
		dustVars.image_url = item.Image_URL__c;
	})
   .on("end", function(query) {
   		res.render('item_finished', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('item_finished', dustVars);
   	}).run();
});

module.exports = router;
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
    	cssFiles: [],
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
			amount : bid.Amount__c,
			bidder_name : bid.Bidder_Account__r.Name,
			item_name : bid.Auction_Item__r.Name
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

    var query_str = "SELECT Current_Bid__c, Description__c, Id, Image_URL__c, Name, Payment_Verified__c, " + 
    				"(SELECT Id, Amount__c, Bidder_Account__r.Name FROM Bids__r ORDER BY Amount__c DESC) FROM Auction_Item__c " + 
    				"WHERE Id = '" + req.params.item_id + "'";

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(item) {
		console.log("Item: " + util.inspect(item, false, null));
		dustVars.name = item.Name;
		dustVars.item_id = req.params.item_id;
		dustVars.description = item.Description__c;
		dustVars.payment_verified = item.Payment_Verified__c;
		dustVars.image_url = item.Image_URL__c;
		dustVars.bids = [];
		if(item.Bids__r) {
			item.Bids__r.records.forEach(function(bid) {
				var temp_bid = {
					bid_id : bid.Id,
					amount : bid.Amount__c,
					bidder_name : bid.Bidder_Account__r.Name
				}
				dustVars.bids.push(temp_bid);
			});
		}
	})
   .on("end", function(query) {
   		//console.log('dust variables: ' + util.inspect(dustVars, false, null));
   		res.render('item_finished', dustVars);
   	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('item_finished', dustVars);
   	}).run();
});

/*POST to remove the top bid for an item*/
router.post('/remove_top_bid', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});
	console.log('in remove top bid post');

	var delete_bid_item_id = req.body.item_id;
	console.log('id of item where top bid will be deleted: ' + delete_bid_item_id);

	var rm_bid_url = '/services/apexrest/bidremove/' + delete_bid_item_id;
	console.log('Remove bid URL: ' + rm_bid_url);
	
	conn.apex.delete(rm_bid_url, {}, function(err, response) {
		console.log('returned from update');
	});
	
	res.status(200).end();
});

/*POST to verify the payment for the item*/
router.post('/payment_verified', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var updated_item = { 
	  Id : req.body.item_id,
	  Payment_Verified__c : (req.body.item_verified == "true")
	}
	conn.sobject("Auction_Item__c").update(updated_item, function(err, ret) {
	  if (err) {
	  	console.error(err, ret);
		res.status(500).end();
	  }
	  else {
	  	console.log('Updated Successfully : ' + ret.id);
	  	res.status(200).end();
	  }
	});
});

module.exports = router;
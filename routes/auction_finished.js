var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');
var request = require('request');

/* GET a finished auction*/
router.get('/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var auctionId = req.params.id;

	var auctionstats_url = '/services/apexrest/bidfresh/auctionstats/' + auctionId;

	var dustVars = {
    	title: 'Auction Summary',
    	cssFiles: [{css: 'auction_finished.css'}],
    	javascriptFiles: [{javascript: 'auction_finished.js'}],
    	top_bidders: []
    }

	var query_str = "SELECT Name, (SELECT Name, Id, bidfresh__Current_Bid__c, bidfresh__Winning_Bidder__r.Name, bidfresh__Winning_Bidder__r.bidfresh__lastName__c, bidfresh__Payment_Verified__c FROM bidfresh__Auction_Items__r) " +
					"FROM bidfresh__Auction__C WHERE Id = '" + auctionId + "'"; //check if need to append prefix on each leavel

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(auction) {
		console.log("Auction: " + util.inspect(auction, false, null));
		dustVars.name = auction.Name;
		dustVars.auction_id = req.params.id;
		dustVars.auction_items = [];
		if(auction.bidfresh__Auction_Items__r) {
			auction.bidfresh__Auction_Items__r.records.forEach(function(item) {
				dustVars.auction_items.push(item);
			});
		}
	})
   .on("end", function(query) {
   		console.log('calling GET on auction stats url: ' + auctionstats_url);
   		conn.apex.get(auctionstats_url, function(err, response) {
			   if(err) {
			  		console.error(err);
			  		res.status(500).end();
			   }
			   else {

			  		console.log("response: ", util.inspect(response, false, null));
			  		// the response object structure depends on the definition of apex class
			  		dustVars.top_bidders = response;

					res.render('auction_finished', dustVars);
			  	}
			});

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

    var query_str = "SELECT bidfresh__Current_Bid__c, bidfresh__Description__c, Id, bidfresh__Image_URL__c, Name, bidfresh__Payment_Verified__c, " + 
    				"(SELECT Id, bidfresh__Amount__c, bidfresh__Bidder_Account__r.Name FROM bidfresh__Bids__r ORDER BY bidfresh__Amount__c DESC) FROM bidfresh__Auction_Item__c " + 
    				"WHERE Id = '" + req.params.item_id + "'";

	/*Gets auction and list of auction items in that auction */
	conn.query(query_str)
	.on("record", function(item) {
		console.log("Item: " + util.inspect(item, false, null));
		dustVars.name = item.Name;
		dustVars.item_id = req.params.item_id;
		dustVars.description = item.bidfresh__Description__c;
		dustVars.payment_verified = item.bidfresh__Payment_Verified__c;
		dustVars.image_url = item.bidfresh__Image_URL__c;
		dustVars.bids = [];
		if(item.bidfresh__Bids__r) {
			item.bidfresh__Bids__r.records.forEach(function(bid) {
				var temp_bid = {
					bid_id : bid.Id,
					amount : bid.bidfresh__Amount__c,
					bidder_name : bid.bidfresh__Bidder_Account__r.Name
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

	var rm_bid_url = '/services/apexrest/bidfresh/bidremove/' + delete_bid_item_id;
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
	  bidfresh__Payment_Verified__c : (req.body.item_verified == "true")
	}
	conn.sobject("bidfresh__Auction_Item__c").update(updated_item, function(err, ret) {
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
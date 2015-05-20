var assert = require('assert'),
auction_route = require('../routes/create_auction')
util = require('util');

describe('CreateNewAuction function', function(){
	it('should create a valid new auction to send to SalesForce', function() {
		var request = {
			body: {
				start_date : "05/18/15, 11:40 AM",
				end_date : "05/18/15, 12:40 PM",
				name : "Test Auction",
				location_picklist : "San Luis Obispo"
			}
		}

		var new_auction = auction_route.createNewAuction(request);

		assert.equal("Test Auction", new_auction.name);
		assert.equal("San Luis Obispo", new_auction.bidfresh__Location__c);
		assert.equal("2015-05-18T18:40:00.000Z", new_auction.bidfresh__Start_Time__c);
		assert.equal("2015-05-18T19:40:00.000Z", new_auction.bidfresh__End_Time__c)
	})
})

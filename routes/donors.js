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
      javascriptFiles: [
         {javascript: 'donors.js'}
      ],
    	donors: []
    }

	var query_str = "SELECT Id, Name, bidfresh__lastName__c, bidfresh__Total_Contributions__c, bidfresh__Auctions_Attended__c, " +
      "(SELECT bidfresh__Auction__r.Name, bidfresh__Auction__r.bidfresh__End_Time__c,bidfresh__Bidder_Account__c FROM bidfresh__Bidder_Attendance__r ORDER BY bidfresh__Auction__r.bidfresh__End_Time__c DESC NULLS FIRST LIMIT 1)" +
      " FROM bidfresh__Bidder_Account__c";
   /*Get List of Donors */
	conn.query(query_str)
	.on("record", function(donor) {
		console.log("Donor: " + util.inspect(donor, false, null));
      if (donor.bidfresh__Bidder_Attendance__r) {
         donor['lastEvent'] = donor.bidfresh__Bidder_Attendance__r.records[0].bidfresh__Auction__r.Name;
      }
      dustVars.donors.push(donor);
   	
	})
   .on("end", function(query) {
   		res.render('donors', dustVars);
	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('donors', dustVars);
	}).run();
});

/* GET the donor view page */
router.get('/:id', function(req, res) {
   var conn = new jsforce.Connection({
      accessToken: req.session.accessToken,
      instanceUrl: req.session.instanceUrl
   });
   var bidder_id = req.params.id;
   var query_str = "SELECT bidfresh__Email__c,bidfresh__lastName__c,Name,bidfresh__Total_Contributions__c, " +
   "(SELECT Id, Name, bidfresh__Current_Bid__c, bidfresh__Auction__r.Name FROM bidfresh__Purchased_Items__r) FROM bidfresh__Bidder_Account__c WHERE Id = '" + bidder_id + "'";

   var dustVars = {
      title: 'View Donor',
      bidder_id: bidder_id,
      cssFiles: [
         {css: 'bootstrap-multiselect.css'},
         {css: 'bootstrap-datetimepicker.min.css'}
      ],
      purchasedItems: []
   };
   console.log('in donors/:id for id: ' + bidder_id);

   /*Get List of Donors */
   conn.query(query_str, function(err, bidderResp) {
      if(err) {
         return console.error(err);
      }
      var bidder = bidderResp.records[0];
      console.log("bidResp: " + util.inspect(bidderResp, false, null));
            
      dustVars["Name"] = bidder.Name + " " + bidder.bidfresh__lastName__c;
      dustVars["email"] = bidder.bidfresh__Email__c;
      dustVars["contributions"] = bidder.bidfresh__Total_Contributions__c;

      console.log("Bidder: " + util.inspect(bidder, false, null));
      if (bidder.bidfresh__Purchased_Items__r) {
         bidder.bidfresh__Purchased_Items__r.records.forEach(function(bidderItem){
            console.log('adding bidder item: ', bidderItem)
            dustVars.purchasedItems.push({
               Name: bidderItem.Name,
               bidfresh__Current_Bid__c: bidderItem.bidfresh__Current_Bid__c,
               AuctionName: bidderItem.bidfresh__Auction__r.Name
            });
         });
         
      }
   })
   .on("end", function(query) {
         res.render('individual_donor', dustVars);
   }).on("error", function(err) {
      console.log("query error" + err);
      res.render('individual_donor', dustVars);
   }).run();

});


module.exports = router;
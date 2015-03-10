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

	var query_str = "SELECT Id, Name, lastName__c, Total_Contributions__c, Auctions_Attended__c, " +
      "(SELECT Auction__r.Name, Auction__r.End_Time__c,Bidder_Account__c FROM Bidder_Attendance__r ORDER BY Auction__r.End_Time__c DESC NULLS FIRST LIMIT 1)" +
      " FROM Bidder_Account__c";
   /*Get List of Donors */
	conn.query(query_str)
	.on("record", function(donor) {
		console.log("Donor: " + util.inspect(donor, false, null));
      if (donor.Bidder_Attendance__r) {
         donor['lastEvent'] = donor.Bidder_Attendance__r.records[0].Auction__r.Name;
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
   var query_str = "SELECT Email__c,lastName__c,Name,Total_Contributions__c, " +
   "(SELECT Id, Name, Current_Bid__c, Auction__r.Name FROM Purchased_Items__r) FROM Bidder_Account__c WHERE Id = '" + bidder_id + "'";

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
            
      dustVars["Name"] = bidder.Name + " " + bidder.lastName__c;
      dustVars["email"] = bidder.Email__c;
      dustVars["contributions"] = bidder.Total_Contributions__c;

      console.log("Bidder: " + util.inspect(bidder, false, null));
      if (bidder.Purchased_Items__r) {
         for (var bidderItem in bidder.Purchased_Items__r.records) {
            dustVars.purchasedItems.push(bidderItem);
         }
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
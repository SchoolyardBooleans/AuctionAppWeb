var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var util = require('util');
var moment = require('moment');
var router = express.Router();


/* GET the edit auction page */
router.get('/:id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});
	console.log('in edit auction');
	var auction_id = req.params.id;
	var query_str = "SELECT Id, Name, Start_Time__c, End_Time__c, Location__r.Name," +
		//"(SELECT Name FROM Auctions__r), " +
		//"Auction_Location__r.Name," + 
		"(SELECT Name, Id, Description__c, Estimated_Value__c FROM Auction_Items__r) FROM Auction__c WHERE Id = '" + auction_id + "'";

	conn.query(query_str, function(err, auction) {
		if(err) {
			return console.error(err);
		}

		var start_str = moment(auction.records[0].Start_Time__c).format('MM/DD/YYYY hh:SS A');
	 	var end_str = moment(auction.records[0].End_Time__c).format('MM/DD/YYYY hh:SS A');
	 	var location_str = auction.records[0].Location__r.Name;
	 	var items = auction.records[0].Auction_Items__r == null ? null : auction.records[0].Auction_Items__r.records;

		/*still needs auction location*/
		var dustVars = {
			title: 'Edit Auction',
			auction_name: auction.records[0].Name,
			auction_id: auction_id,
			auction_start_date: start_str,
			auction_end_date: end_str,
			auction_location: location_str,
			auction_items: items,
			cssFiles: [
				{css: 'edit_auction.css'},
				{css: 'formValidation.min.css'},
				{css: 'bootstrap-datetimepicker.min.css'}
			],
			javascriptFiles: [
				{javascript: 'bootstrap-datetimepicker.min.js'},
				{javascript: 'formValidation.min.js'},
				{javascript: 'formValidation-bootstrap.min.js'},
				{javascript: 'edit_auction.js'}
			]
		};

		res.render('edit_auction', dustVars);
	});

	// conn.sobject('Auction__c').retrieve(auction_id, function(err, auction) {
	//  	if (err) {
	//  		return console.error(err);
	//  	}

	//  	var start_str = moment(auction.Start_Time__c).format('MM/DD/YYYY hh:SS A');
	//  	var end_str = moment(auction.End_Time__c).format('MM/DD/YYYY hh:SS A');

	// 	/*still needs auction location*/
	// 	var dustVars = {
	// 		title: 'Edit Auction',
	// 		auction_name: auction.Name,
	// 		auction_id: auction_id,
	// 		auction_start_date: start_str,
	// 		auction_end_date: end_str,
	// 		cssFiles: [
	// 			{css: 'edit_auction.css'},
	// 			{css: 'formValidation.min.css'},
	// 			{css: 'bootstrap-datetimepicker.min.css'}
	// 		],
	// 		javascriptFiles: [
	// 			{javascript: 'bootstrap-datetimepicker.min.js'},
	// 			{javascript: 'formValidation.min.js'},
	// 			{javascript: 'formValidation-bootstrap.min.js'},
	// 			{javascript: 'edit_auction.js'}
	// 		]
	// 	};

	// 	console.log('Here is auction object: ' + util.inspect(auction, false, null));

	// 	res.render('edit_auction', dustVars);
	// });
});

/* POST edited auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var start_date = new Date(req.body.start_date).toISOString(),
		end_date = new Date(req.body.end_date).toISOString();

	/*Still need to add on a location*/
	var auction = {
		Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		Id: req.body.id,
		name : req.body.name,
		Start_Time__c : start_date,
		End_Time__c : end_date
	}

	console.log(auction);

	// Single record update
	conn.sobject("Auction__c").update(auction, function(err, ret) {
		if (err || !ret.success) {
			res.status(406).end();
			return console.error(err, ret);
		}
		else {
			res.status(200).end();
			console.log('Updated Successfully : ' + ret.id);
		}
	});

});

/*Get add an item to auction page*/
router.get('/:id/add_item', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var auction_id = req.params.id;
	console.log('Auction ID: ' + auction_id);

	conn.sobject('Auction__c').retrieve(auction_id, function(err, auction) {
	 	if (err) {
	 		return console.error(err);
	 	}

		var dustVars = {
			title: 'Add Item',
			cssFiles: [
				{css: 'add_item.css'},
				{css: 'bootstrap-multiselect.css'},
				{css: 'formValidation.min.css'}
			],
			javascriptFiles: [
				{javascript: 'bootstrap-filestyle.min.js'},
				{javascript: 'bootstrap-multiselect.js'},
				{javascript: 'formValidation.min.js'},
				{javascript: 'formValidation-bootstrap.min.js'},
				{javascript: 'add_item.js'}
			]
		};

		res.render('add_item', dustVars);
	});
});

router.post('/:id/add_item', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	console.log('multer body: ' + util.inspect(req.body, false, null));
	console.log('multer files: ' + util.inspect(req.files, false, null));

	var item = {
		Auction__c : req.params.id,
		Description__c : req.body.item_description,
		Estimated_Value__c : Number(req.body.item_value),
		Featured__C : Boolean(req.body.is_featured),
		Sponsor_Name__c : req.body.sponsor,
		Name : req.body.item_name,
		Starting_Bid__c : req.body.item_min_bid
	};

	conn.sobject('Auction_Item__c').create(item, function(err, ret) {
		if (err || !ret.success) {
			res.status(406).end();
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.status(200).redirect('/edit_auction/' + req.params.id);
	});
});


module.exports = router;
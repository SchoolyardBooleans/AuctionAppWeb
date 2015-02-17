var express = require('express');
var jsforce = require('jsforce');
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
	// TODO: Make sure files is image
	var multerBody = req.body;
	//only one file for now, testing
	var multerFile = req.files;
	var multerFileImage = multerFile.image;
	// Hardcoded document folder id for 'Public_Images'
	var folderId = '00lj0000000z5hsAAA';
	// Hardcoded Orgid 
	var orgId = '00Dj0000000K54X';

	console.log('multer body: ' + util.inspect(multerBody, false, null));
	console.log('multer file: ' + util.inspect(multerFile, false, null));

	//Sending img data to salesforce 

	var encodedData = multerFileImage.buffer.toString('base64');

	var imgDoc = {	
	  //ParentId: accountId,
	  Name: multerFileImage.originalname,
	  Description: multerBody.item_description,
	  body: encodedData,
	  Type: multerFileImage.extension,
	  IsPublic: true,
	  FolderId: folderId
	};

	conn.sobject('Document').create(imgDoc, function(err, ret) {
		if (err || !ret.success) {
			res.status(406).end();
			return console.error(err, ret);
		}

		console.log('Doc create return: ' + util.inspect(ret, false, null));
  		console.log("Created Document id : " + util.inspect(ret.id, false, null));
  		//try not responding?
  		//res.status(200).redirect('/edit_auction/' + req.params.id);
		
		//assemble img instanceUrl
		var imgUrl = 'https://c.na16.content.force.com/servlet/servlet.ImageServer?id=' + ret.id + '&oid=' + req.session.orgId;
		//create item
   	
   		//TODO: seperate post methods of img and item
		var item = {
			Auction__c : req.params.id,
			Description__c : req.body.item_description,
			Estimated_Value__c : Number(req.body.item_value),
			Featured__C : Boolean(req.body.is_featured),
			Sponsor_Name__c : req.body.sponsor,
			Name : req.body.item_name,
			Starting_Bid__c : req.body.item_min_bid,
			Image_URL__c : imgUrl
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
});

/*Get add an item to auction page*/
router.get('/:auction_id/edit_item/:item_id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var auction_id = req.params.auction_id,
		item_id = req.params.item_id;

	conn.sobject('Auction_Item__c').retrieve(item_id, function(err, item) {
		if (err) {
			return console.error(err, ret);
		}

		console.log(util.inspect(item, false, null));

		var dustVars = {
			title: 'Edit Item',
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

module.exports = router;	

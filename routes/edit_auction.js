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
	var auction_id = req.params.id;
	var query_str = "SELECT Id, Name, Location__c, Location__r.Id, Start_Time__c, End_Time__c, Location__r.Name, Status__c," +
		"(SELECT Name, Id, Description__c, Estimated_Value__c FROM Auction_Items__r) FROM Auction__c WHERE Id = '" + auction_id + "'";

	var dustVars = {
		title: 'Edit Auction',
		auction_id: auction_id,
		cssFiles: [
			{css: 'edit_auction.css'},
			{css: 'formValidation.min.css'},
			{css: 'bootstrap-multiselect.css'},
			{css: 'bootstrap-datetimepicker.min.css'}
		],
		javascriptFiles: [
			{javascript: 'bootstrap-datetimepicker.min.js'},
			{javascript: 'bootstrap-multiselect.js'},
			{javascript: 'formValidation.min.js'},
			{javascript: 'formValidation-bootstrap.min.js'},
			{javascript: 'edit_auction.js'}
		],
		auctionVenues: []
	};



	conn.query(query_str, function(err, auction) {
		if(err) {
			return console.error(err);
		}
		
		var start_str = moment(auction.records[0].Start_Time__c).format('MM/DD/YYYY hh:SS A'),
	 		end_str = moment(auction.records[0].End_Time__c).format('MM/DD/YYYY hh:SS A'),
	 		location_id = auction.records[0].Location__c,
	 		location_str = auction.records[0].Location__r == null ? null : auction.records[0].Location__r.Name,
	 		items = auction.records[0].Auction_Items__r == null ? null : auction.records[0].Auction_Items__r.records,
			status_str = genStatusString(auction.records[0].Status__c);

		console.log("locaiont__c for this auciton: " + location_id);

		dustVars.auction_name = auction.records[0].Name;
		dustVars.auction_start_date = start_str;
		dustVars.auction_end_date = end_str;
		dustVars.auction_location = location_str;
		dustVars.auction_items = items;
		dustVars.auction_status = status_str;
		dustVars.location_id = location_id;
	}).on("end", function(query) {
		//ned origin
		/*Get List of sponsors */
		conn.query("SELECT Id, Name FROM Auction_Venue__c")
		.on("record", function(record) {
			console.log('Name : ' + record.Name  + ', Id: ' + record.Id);
			var entry_classes = null;
			
			if (String(record.Id).trim() === String(dustVars.location_id).trim())
			{
				console.log('Adding selected class to location entry: ' + record.Name);
				entry_classes = 'selected';
			}
			dustVars.auctionVenues.push({
				id: record.Id, 
				name: record.Name,
				classes: entry_classes});
		})
	   .on("end", function(query) {
   		//moved here from end of callback
   		res.render('edit_auction', dustVars);
   	}).on("error", function(err) {
   		console.log("query error" + err);
   		res.render('edit_auction', dustVars);
   	}).run(); 

		//begining orig
	}).on("error", function(err) {
		console.log("query error" + err);
		res.render('edit_auction', dustVars);
 	}).run();
});

/* POST edited auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var start_date = new Date(req.body.start_date).toISOString(),
		end_date = new Date(req.body.end_date).toISOString();

	console.log("Updated auction location: " + util.inspect(req.body.location_picklist));
	/*Still need to add on a location*/
	var auction = {
		Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		Id: req.body.id,
		name : req.body.name,
		Start_Time__c : start_date,
		End_Time__c : end_date,
		Location__c : req.body.location_picklist
	}
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
			],
			sponsorAccounts: []
		};

		/*Get List of sponsors */
		conn.query("SELECT Id, Name FROM Sponsor__c")
		.on("record", function(record) {
			console.log('Name : ' + record.Name  + ', Id: ' + record.Id);
			dustVars.sponsorAccounts.push({
				id: record.Id,
				name: record.Name});
		})
	   .on("end", function(query) {
	   		//moved here from end of callback

	   		res.render('add_item', dustVars);
	   	}).on("error", function(err) {
	   		console.log("query error" + err);
 	   	}).run();



		//res.render('add_item', dustVars);
	});
});




router.post('/:id/add_item', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var item = {
		Auction__c : req.params.id,
		Description__c : req.body.item_description,
		Estimated_Value__c : Number(req.body.item_value),
		Featured__C : Boolean(req.body.is_featured),
		Sponsor_Name__c : req.body.sponsor,
		Item_Sponsor__c: req.body.sponsor_picklist,
		Name : req.body.item_name,
		Starting_Bid__c : req.body.item_min_bid
	};

	//only one file for now, testing
	var multerFile = req.files;

	if(multerFile != null && multerFile.image != null) {
		var multerFileImage = multerFile.image;

		console.log('Body: ' + util.inspect(req.body, false, null));
		console.log('multer file: ' + util.inspect(multerFile, false, null));

		// Hardcoded document folder id for 'Public_Images'
		var folderId = '00lj0000000z5hsAAA';
		// Hardcoded Orgid 
		var orgId = '00Dj0000000K54X';

		//Sending img data to salesforce 

		var encodedData = multerFileImage.buffer.toString('base64');

		var imgDoc = {	
		  //ParentId: accountId,
		  Name: multerFileImage.originalname,
		  Description: req.body.item_description,
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
			
			//assemble img instanceUrl
			var imgUrl = 'https://c.na16.content.force.com/servlet/servlet.ImageServer?id=' + ret.id + '&oid=' + req.session.orgId;
			item.Image_URL__c = imgUrl;

			createItem(req, res, conn, item);
		});
	}
	else {
		createItem(req, res, conn, item);
	}
});

function createItem(req, res, conn, item) {
	conn.sobject('Auction_Item__c').create(item, function(err, ret) {
		if (err || !ret.success) {
			res.status(406).end();
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.status(200).redirect('/edit_auction/' + req.params.id);
	});
}

/*DELETE an item*/
router.delete('/delete_item/:id', function(req, res) {
	console.log("In the delete item route");
	var item_id = req.params.id;
	console.log("Item id to delete is: " + item_id);

	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	conn.sobject("Auction_Item__c").destroy(item_id, function(err, ret) {
  		if(err || !ret.success) {
  			console.error(err, ret);
  			res.status(500).end();
  		}
  		else {
  			console.log('Deleted Successfully : ' + ret.id);
  			res.status(200).end();
  		}
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
			return console.error(err, item);
		}

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
				{javascript: 'edit_item.js'}
			],
			item_name: item.Name,
			item_description: item.Description__c,
			item_value: item.Estimated_Value__c,
			item_min_bid: item.Starting_Bid__c,
			item_image: item.Image_URL__c,
			item_featured: item.Featured__c,
			item_sponsor: item.Sponsor_Name__c,
			sponsor_id: item.Item_Sponsor__c,
			sponsorAccounts: []
		};

		/*Get List of sponsors */
		conn.query("SELECT Id, Name FROM Sponsor__c")
		.on("record", function(record) {
			console.log('Name : ' + record.Name  + ', Id: ' + record.Id);
			var new_entry = {id: record.Id, name: record.Name}
			if (record.Id == dustVars.sponsor_id)
			{
				console.log('Adding selected class to sponsor entry: ' + record.Name);
				new_entry['classes'] = 'selected';
			}
			dustVars.sponsorAccounts.push(new_entry);
		})
	   .on("end", function(query) {
	   		//moved here from end of callback

	   		res.render('edit_item', dustVars);
	   	}).on("error", function(err) {
	   		console.log("query error" + err);
 	   	}).run();

		
	});
});

router.post('/:auction_id/edit_item/:item_id', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var multerBody = req.body,
		multerFile = req.files,
		// Hardcoded document folder id for 'Public_Images'
		folderId = '00lj0000000z5hsAAA',
		orgId = req.session.orgId,
		item = {
			Id : req.params.item_id,
			Description__c : req.body.item_description,
			Estimated_Value__c : Number(req.body.item_value),
			Featured__C : Boolean(req.body.is_featured),
			Sponsor_Name__c : req.body.sponsor,
			Name : req.body.item_name,
			Starting_Bid__c : req.body.item_min_bid
		};

	console.log('multer body: ' + util.inspect(multerBody, false, null));
	console.log('multer file: ' + util.inspect(multerFile, false, null));

	/*Check to see if a new image was uploaded*/
	if(!isEmpty(multerFile)) {
		console.log("user uploaded new image");
		//Sending img data to salesforce 
		var multerFileImage = multerFile.image,
			encodedData = multerFileImage.buffer.toString('base64'),
			imgDoc = {
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

	  		console.log("Created Document id : " + ret.id);
			
			//assemble img instanceUrl
			var imgUrl = 'https://c.na16.content.force.com/servlet/servlet.ImageServer?id=' + ret.id + '&oid=' + orgId;
			item.Image_URL__c = imgUrl;

			console.log('Updated item: ' + util.inspect(item, false, null));

			conn.sobject('Auction_Item__c').update(item, function(err, ret) {
				if (err || !ret.success) {
					res.status(406).end();
					return console.error(err, ret);
				}

		  		console.log("Updated record id : " + ret.id);
		  		res.status(200).redirect('/edit_auction/' + req.params.auction_id);
			});
		});
	}
	else {
		console.log('user did not upload image');
		conn.sobject('Auction_Item__c').update(item, function(err, ret) {
			if (err || !ret.success) {
				res.status(406).end();
				return console.error(err, ret);
			}

	  		console.log("Updated record id : " + ret.id);
	  		res.status(200).redirect('/edit_auction/' + req.params.auction_id);
		});
	}
});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

/*
	return the appropriate string for an auction status enum.
*/
function genStatusString(statusNum) {
    var status_str = "Upcoming";

	if(statusNum == 1) {
		status_str = "In Progress";
	}
	else if(statusNum == 2) {
		status_str = "Complete";
	}

	return status_str
}

module.exports = router;	

var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var router = express.Router();

/* GET the edit auction page */
router.get('/:id', function(req, res) {
	var dustVars = {
		title: 'Edit Auction',
		auction_name: 'My Auction',
		auction_location: 'My House',
		auction_start_date: '01/26/2014 07:30 PM',
		auction_end_date: '01/27/2014 07:30 PM',
		cssFiles: [
			{css: 'edit_auction.css'},
			{css: 'formValidation.min.css'},
			{css: 'bootstrap-datetimepicker.min.css'}
		],
		javascriptFiles: [
			{javascript: 'bootstrap-datetimepicker.min.js'},
			{javascript: 'formValidation.min.js'},
			{javascript: 'edit_auction.js'}
		]
	};
	
	console.log("ID is: " + req.params.id);

	res.render('edit_auction', dustVars);
});

/* POST created auction */
router.post('/', function(req, res) {
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});

	var body = {
		name: req.body.name,
		orgId: 'a0Zj0000000eDTTEA2', 
		location: req.body.location,
		startDate: req.body.date
	};

	console.log("Req body %j", req.body);

	request.post(
	    'https://schooolyardbooleans-developer-edition.na16.force.com/public/services/apexrest/auctions',
	    {
	    	json: {
	    		name: req.body.name,
	    		orgId: 'a0Zj0000000eDTTEA2',
	    		location: req.body.location,
				startDate: req.body.start_date,
				endDate: req.body.end_date
			}
		},
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body);
	        }
	        else {
	        	console.log('Error: ' + error + '\n' + 'Response code: ' + response.statusCode + '\n' + 'Body: ' + body);

	        	/*Need to notify that auction was not created somehow*/
	        }

	        res.end();
	    }
	);
});



module.exports = router;
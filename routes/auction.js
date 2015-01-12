var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var router = express.Router();

/* GET the create auction page */
router.get('/', function(req, res) {
	var dustVars = {
		title: 'Create Auction',
		cssFiles: [
			{css: 'create_auction.css'},
			{css: 'datepicker.css'}],
		javascriptFiles: [
			{javascript: 'datepicker.js'},
			{javascript: 'create_auction.js'}]
	};
	res.render('create_auction', dustVars);
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
	    { json: { name: req.body.name,
	    			  orgId: 'a0Zj0000000eDTTEA2',
	    			  location: req.body.location,
					  startDate: req.body.date } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body);
	            res.redirect('/');
	        }
	    }
	);
});



module.exports = router;

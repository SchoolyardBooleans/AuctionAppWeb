var express = require('express');
var jsforce = require('jsforce');
// won't be needed later
var request = require('request');
var router = express.Router();

/* Get the create auction page */
router.get('/', function(req, res) {
	console.log('In auction');
	res.render('create_auction', { title: 'Auction App Baby!' });
});

/* Put auction */
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

	// FIGURE THIS OUT	
	// conn.apex.post("/auctions", body, function(err, res) {
	// 	if (err) { return console.error(err); }
	// 	console.log("response: ", res);
	// });

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

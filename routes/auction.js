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

	request.post(
	    'https://schooolyardbooleans-developer-edition.na16.force.com/public/services/apexrest/auctions',
	    { json: { name: req.body.auctionName,
	    			  orgId: 'a0Zj0000000eDTTEA2' } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
	    }
	);

	// In the future it will be something like this
	// conn.sobject("Auction").create({'Auction Name': req.body.auctionName,
	// 											'Hosting Nonprofit': 'a0Zj0000000eDTTEA2'}, function(err, ret) {
	// 	if (err || !ret.success) { return console.error(err, ret); }
 //  		console.log("Created auction id : " + ret.id);
 //  		// ...
	// });

	console.log('Submitting auction');
});



module.exports = router;

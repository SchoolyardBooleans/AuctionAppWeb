var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res) {

	request.get({
	    url: 'https://schooolyardbooleans-developer-edition.na16.force.com/public/services/apexrest/nonprofits',
	    json: true},
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body);
	            console.log(body[0].Name);

	            var dustVars = {
	            	title: 'Auction App',
	            	cssFiles: [{css: 'index.css'}],
	            	auctions: body[0].auctions
	            }

	            res.render('index', dustVars);
	        }
	        else {
	        	console.log("Unable to access REST API.");
	        	console.log("Error: " + error);
	        	console.log("Response: " + response.statusCode);

	        	var dustVars = {
	            	title: 'Auction App',
	            	cssFiles: [{css: 'index.css'}]
	            }

	            res.render('index', dustVars);
	        }
	    }
	);

});



module.exports = router;

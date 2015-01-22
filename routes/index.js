var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res) {

	request.get({
	    url: 'https://schooolyardbooleans-developer-edition.na16.force.com/public/services/apexrest/nonprofits',
	    json: true},
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body);
	            console.log(body[0]);

	            var auction_list = body[0].auctions;

	            auction_list.forEach(function(auction, index, auctions) {
	            	auctions[index].Start_Time = moment(auction.Start_Time).format('MM/DD/YYYY hh:SS A');
	            	auctions[index].End_Time = moment(auction.End_Time).format('MM/DD/YYYY hh:SS A');
	            });

	            var dustVars = {
	            	title: 'Auction App',
	            	cssFiles: [{css: 'index.css'}],
	            	javascriptFiles: [{javascript: 'index.js'}],
	            	auctions: auction_list
	            }

	            res.render('index', dustVars);
	        }
	        else {
	        	console.log("Unable to access REST API.");
	        	console.log("Error: " + error);

	        	var dustVars = {
	            	title: 'Auction App',
	            	cssFiles: [{css: 'index.css'}],
	            	javascriptFiles: [{javascript: 'index.js'}],
	            }

	            res.render('index', dustVars);
	        }
	    }
	);

});



module.exports = router;

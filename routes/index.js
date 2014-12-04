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
	            res.render('index', { title: 'Auction App Baby!', auctions: body[0].auctions});
	        }
	    }
	);

	//res.render('index', { title: 'Auction App Baby!' });
});



module.exports = router;

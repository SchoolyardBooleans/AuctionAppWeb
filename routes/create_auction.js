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
			{css: 'formValidation.min.css'},
			{css: 'bootstrap-datetimepicker.min.css'}
		],
		javascriptFiles: [
			{javascript: 'bootstrap-datetimepicker.min.js'},
			{javascript: 'formValidation.min.js'},
			{javascript: 'create_auction.js'}
		]
	};
	res.render('create_auction', dustVars);
});

/* POST created auction */
router.post('/', function(req, res) {
	console.log("Auction posted");
	var conn = new jsforce.Connection({
		accessToken: req.session.accessToken,
		instanceUrl: req.session.instanceUrl
	});
	console.log("Auction posted 2");
	var start_date = new Date(req.body.start_date).toISOString(),
		end_date = new Date(req.body.end_date).toISOString();

		console.log("Auction posted 3");

	var auction = {
		Hosting_Nonprofit__c : 'a0Zj0000000eDTTEA2',
		name : req.body.name,
		Start_Time__c : start_date,
		End_Time__c : end_date
	}
	console.log("Auction posted 4");

	conn.sobject('Auction__c').create(auction, function(err, ret) {
		if (err || !ret.success) {
			return console.error(err, ret);
		}

  		console.log("Created record id : " + ret.id);
  		res.end();
	});

	console.log("Auction posted 5");

	// var body = {
	// 	name: req.body.name,
	// 	orgId: 'a0Zj0000000eDTTEA2', 
	// 	location: req.body.location,
	// 	startDate: req.body.date
	// };

	// console.log("Req body %j", req.body);

	// request.post(
	//     'https://schooolyardbooleans-developer-edition.na16.force.com/public/services/apexrest/auctions',
	//     {
	//     	json: {
	//     		name: req.body.name,
	//     		orgId: 'a0Zj0000000eDTTEA2',
	//     		location: req.body.location,
	// 			startDate: req.body.start_date,
	// 			endDate: req.body.end_date
	// 		}
	// 	},
	//     function (error, response, body) {
	//         if (!error && response.statusCode == 200) {
	//             console.log(body);
	//         }
	//         else {
	//         	console.log('Error: ' + error + '\n' + 'Response code: ' + response.statusCode + '\n' + 'Body: ' + body);

	//         	/*Need to notify that auction was not created somehow*/
	//         }

	//         res.end();
	//     }
	// );
});



module.exports = router;

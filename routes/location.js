var express = require('express');
var router = express.Router();
var util = require('util');
var jsforce = require('jsforce');

/* POST location. */
router.post('/', function(req, res) {
  var conn = new jsforce.Connection({
    accessToken: req.session.accessToken,
    instanceUrl: req.session.instanceUrl
  });

  var location_name = req.body.new_location_name;

  console.log("location name is: " + location_name);

  var location = {
    Name : location_name
  }

  conn.sobject('bidfresh__Auction_Venue__c').create(location, function(err, ret) {
    if (err || !ret.success) {
      res.status(500).end();
      return console.error(err, ret);
    }

      console.log("Created Auction Venue object with id: " + ret.id);
      console.log("ret object is: " + util.inspect(ret, false, null));

      // res.status(200).json({id : ret.id}).end();
      res.status(200).send({id : ret.id}).end();
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	var dustVars = {
    	title: 'View Donors',
    	cssFiles: [{css: 'donors.css'}],
    	auctions: []
    }
    
  	res.render('donors', dustVars);
});

module.exports = router;
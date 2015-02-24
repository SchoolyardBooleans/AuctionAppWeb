var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var util = require('util');
var cId = process.env.CLIENT_ID || '3MVG9fMtCkV6eLhf_.BQiGsIkFrST_DhAezGVR8iA.fnmsZe9ciV3NxOkI1.y0jo26qDFS3FjCwfm84xGfCaR';
var cSecret = process.env.CLIENT_SECRET || '7491496118908735789';
var rUri = process.env.REDIRECT_URI || 'http://localhost:3000/oauth/callback';

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  clientId : cId,
  clientSecret : cSecret,
  redirectUri : rUri
});

/* GET login page. */
router.get('/', function(req, res) {
    var dustVars = {
        title: 'Login',
        cssFiles : [{css: 'login.css'}]
    };

	res.render('login', dustVars);
});

/* GET login salesforce page. */
router.get('/salesforce', function(req, res) {
	res.redirect(oauth2.getAuthorizationUrl({scope: 'api web'}));
});
 
// This gets run upon successful authentication to Salesforce.
// Save the users accessToken and instanceURL for usage across
// the app.
router.get('/callback', function(req, res) {
    var conn = new jsforce.Connection({oauth2: oauth2});
    var code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }
 
        console.log('Access Token: ' + conn.accessToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);

        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.userId = userInfo.id;
        req.session.orgId = userInfo.organizationId;

        // Redirect to home page
        res.redirect('/');
    });
});

router.get('/logout', function(req, res) {
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    conn.logout(function(err) {
        if(err) {
            return console.error(err);
        }
        
        console.log('User logged out');
        res.redirect('/oauth');
    });
});

module.exports = router;

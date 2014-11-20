var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  //loginUrl : 'https://test.salesforce.com',
  clientId : '3MVG9fMtCkV6eLhcuzVYXzE9.nFVX5hpeBmV.J5n2r920iY95nra4qsnaq5roQVr3uY4XPdYKj3HD9ePAwcZ2',
  clientSecret : '1731632782131226790',
  redirectUri : 'http://localhost:3000/oauth/callback'
});

/* GET login page. */
router.get('/', function(req, res) {
	res.render('login', { title: 'Auction App Baby!' });
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
        // Redirect to home page
        res.redirect('/');
    });
});

module.exports = router;

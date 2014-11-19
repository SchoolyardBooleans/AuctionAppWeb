var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var dustHelper = require('dustjs-helpers');
var jsforce = require('jsforce');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId : '3MVG9fMtCkV6eLhd_Ci9gKcU8wJNrzR3P1g_9FBdsK00qNoyA4B6XsKRGxYoeJq3mDpQN3diSpOdtjv5Wp0g9',
  clientSecret : '8096065161182768313',
  redirectUri : '/oauth/callback'
});

// view engine setup
app.engine('dust', cons.dust);
var template_engine = 'dust';
app.set('template_engine', template_engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', template_engine);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* SF OAuth request, redirect to SF login */
app.get('/oauth/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web'}));
});
 
/* OAuth callback from SF, pass received auth code and get access token */
app.get('/oauth/callback', function(req, res) {
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
        res.redirect('/');
    });
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;

app.listen(3000);

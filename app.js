/*require dependency modules*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var dustHelper = require('dustjs-helpers');
var session = require('express-session')
var template_engine = 'dust';
var multer = require('multer');

var app = express();

/*Set Dustjs as view engine*/
app.engine('dust', cons.dust);
app.set('template_engine', template_engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', template_engine);

app.use(favicon(__dirname + '/public/images/sf.png'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  saveUninitialized: true,
  resave: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// For every request check if the user's Salesforce token is still valid,
// if not take the user to the login page.
app.use(function (req, res, next) {
  var path = req.path;

  /*If user doesn't have credentials and is requesting a non login page, redirect to login*/
  if (path.indexOf('oauth') == -1 && (!req.session.accessToken || !req.session.instanceUrl)) { 
    res.redirect('/oauth');
  }
  else {
    console.log('Valid token: ' + req.session.accessToken);
    console.log('Valid instanceUrl: ' + req.session.instanceUrl);
    next();  
  }
});

app.use(multer({
  inMemory : true
}));

var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');
var create_auction = require('./routes/create_auction');
var edit_auction = require('./routes/edit_auction');
var donors = require('./routes/donors');
var auction_finished = require('./routes/auction_finished');
app.use('/', routes);
app.use('/users', users);
app.use('/oauth', oauth);
app.use('/create_auction', create_auction);
app.use('/edit_auction', edit_auction);
app.use('/donors', donors);
app.use('/auction_summary', auction_finished);


/*Dev error handler, prints stack trace*/
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/*Production error handler, no stack trace shown*/
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

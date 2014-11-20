var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var dustHelper = require('dustjs-helpers');
var session = require('express-session')
var template_engine = 'dust';

var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');


var app = express();

// view engine setup
app.engine('dust', cons.dust);
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

  // If the path is under oauth do not redirect
  // If the user's token and url are valid do not redirect
  if (path.indexOf('oauth') == -1 && (!req.session.accessToken || !req.session.instanceUrl)) { 
    res.redirect('/oauth');
  } else {
    console.log('Valid token: ' + req.session.accessToken);
    console.log('Valid instanceUrl: ' + req.session.instanceUrl);
    next();  
  }
});

app.use('/', routes);
app.use('/users', users);
app.use('/oauth', oauth);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

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

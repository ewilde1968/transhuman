
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Database = require('./database')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('transhumanCookieSecret'));
app.use(express.session({ secret: 'transhumanSessionSecret'}));
app.use( function(q,r,n) {r.locals.title = "Transhuman";n();});
app.use( function(q,r,n) {app.database.authMiddleware(q,r,n);});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// setup DB
app.database = new Database();

// routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/login/:signupEmail', routes.loginPrepop);
app.post('/login', app.database.loginAttempt, routes.loginAttempt);
app.get('/signup', routes.signup);
app.post('/signup', app.database.createAccount, routes.createdAccount);
app.get('/logout', routes.logout);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

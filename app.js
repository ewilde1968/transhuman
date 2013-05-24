
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    Database = require('./model/database'),
    User = require('./model/user'),
    World = require('./model/world'),
    Homeland = require('./model/homeland'),
    Mod = require('./model/mod'),
    Character = require('./model/character');

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
app.use( function(q,r,n) {User.authMiddleware(q,r,n);});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// setup DB
app.database = new Database();
app.database.initialize();
// routes
app.get('/', routes.index);
app.get('/login/:signupEmail', routes.index);
app.post('/login', User.loginAttempt, routes.loginAttempt);
app.get('/signup', routes.signup);
app.post('/signup', User.createAccount, routes.createdAccount);
app.get('/logout', routes.logout);
app.get('/user/:id', routes.user);
app.get('/wizard/choosehomeland', User.secure, Character.createCharacter, routes.wizardChooseHomeland);
app.post('/wizard/choosehomeland', User.secure, Character.setHomeland, routes.wizardSetHomeland);
app.get('/wizard/chooseprofession', User.secure, routes.wizardChooseProfession);
app.post('/wizard/chooseprofession', User.secure, Character.setProfession, routes.wizardSetProfession);
app.get('/wizard/choosestats', User.secure, routes.wizardChooseStats);
app.post('/wizard/choosestats', User.secure, Character.setStats, routes.wizardSetStats);
app.get('/wizard/choosemods', User.secure, routes.wizardChooseMods);
app.post('/wizard/choosemods', User.secure, Character.setMods, routes.wizardSetMods);
app.get('/wizard/chooseitems', User.secure, routes.wizardChooseItems);
app.post('/wizard/chooseitems', User.secure, Character.setItems, routes.wizardSetItems);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
    console.log('Socket.IO connected');
    
    socket.emit('connected');
    socket.on('worlds', function(callback) {World.getArray(callback);});
    socket.on('locales', function(world,callback) {Homeland.getArrayOfWorld(world,callback);});
});

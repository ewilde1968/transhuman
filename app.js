
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
app.get('/wizard/cancel', Character.cancelCharacter, function(q,r,n) {r.redirect('/');});
app.get('/wizard/choosehomeland', User.secure, Character.createCharacter, routes.wizardChooseHomeland);
app.post('/wizard/choosehomeland', User.secure, Character.setHomeland, routes.wizardSetHomeland);
app.get('/wizard/choosehomeland/:world/:homeland', User.secure, routes.wizardChooseHomelandDetail);
app.get('/wizard/chooseprofession', User.secure, routes.wizardChooseProfession);
app.post('/wizard/chooseprofession', User.secure, Character.setProfession, routes.wizardSetProfession);
app.get('/wizard/choosestats', User.secure, routes.wizardChooseStats);
app.post('/wizard/choosestats', User.secure, Character.setStats, routes.wizardSetStats);
app.get('/wizard/choosemods', User.secure, routes.wizardChooseMods);
app.post('/wizard/choosemods', User.secure, routes.wizardSetMods);
app.get('/wizard/choosemods/:mod', User.secure, routes.wizardChooseModsDetail);
app.get('/wizard/chooseitems', User.secure, routes.wizardChooseItems);
app.post('/wizard/chooseitems', User.secure, routes.wizardSetItems);
app.get('/wizard/chooseitems/:item', User.secure, routes.wizardChooseItemsDetail);
app.get('/wizard/choosedetails', User.secure, routes.wizardChooseDetails);
app.post('/wizard/choosedetails', User.secure, Character.setDetails, routes.wizardSetDetails);
app.get('/character/:id/name', User.secure, routes.name);
app.post('/character/:id/name', User.secure, Character.changeName, routes.changeName);
app.get('/character/:id/homeland', User.secure, routes.homeland);
app.get('/character/:id/race', User.secure, routes.race);
app.get('/character/:id/soma', User.secure, routes.soma);
app.post('/character/:id/soma', User.secure, Character.changeSoma, routes.soma);
app.get('/character/:id/nous', User.secure, routes.nous);
app.post('/character/:id/nous', User.secure, Character.changeNous, routes.nous);
app.get('/character/:id/profession', User.secure, routes.profession);
app.post('/character/:id/profession', User.secure, Character.changeProfession);
app.get('/character/:id/humanity', User.secure, routes.humanity);
app.post('/character/:id/humanity', User.secure, Character.changeHumanity);
app.get('/character/:id/mods', User.secure, routes.mods);
app.get('/character/:id/buymods', User.secure, routes.buyMods);
app.get('/character/:id/mod/:modname', User.secure, routes.modDetail);
app.post('/character/:id/mod/:modid', User.secure, Character.setModById, routes.setModById);
app.get('/character/:id/items', User.secure);
app.get('/character/:id/item/:itemname', User.secure, routes.itemDetail);
app.post('/character/:id/item/:itemid', User.secure, Character.setItemById, routes.setItemById);
app.get('/character/:id/histories', User.secure);
app.post('/character/:id/history/:historyid', User.secure);
app.get('/character/:id', User.secure, routes.character);

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

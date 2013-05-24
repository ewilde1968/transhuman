
/*
 * Database Utility Routes
 */
module.exports = Database;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    World = require('./world'),
    Homeland = require('./homeland'),
    Mod = require('./mod'),
    Item = require('./item'),
    User = require('./user');

var connected = false;
function Database () {
    if( !connected)
        mongoose.connect('mongodb://127.0.0.1/transhuman');
    connected = true;
    
    return this;
};

Database.prototype.initialize = function() {
    World.initializeDB();
    Mod.initializeDB();
    Item.initializeDB();
};

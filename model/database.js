
/*
 * Database Utility Routes
 */
module.exports = Database;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    World = require('./world'),
    Homeland = require('./homeland'),
    Mod = require( './mod'),
    User = require('./user');

var connected = false;
function Database () {
    if( !connected)
        mongoose.connect('mongodb://127.0.0.1/transhuman');
    connected = true;
    
    return this;
};

Database.prototype.initialize = function() {
    // Reset all the default data in the database.
    //mongoose.connection.db.dropDatabase('transhuman');

    World.initializeDB();
    Mod.initializeDB();
};

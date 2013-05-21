
/*
 * Database Utility Routes
 */
module.exports = Database;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    World = require('./world'),
    Homeland = require('./homeland'),
    User = require('./user');

/**
 * Define models
 **/

var Basic = mongoose.model('Basic', new Schema( {
    name:       String,
    desc:       String
}));

var History = mongoose.model('History', new Schema( {
    name:       String,
    desc:       String,
    datetime:   Date
}));

var Boost = mongoose.model('Boost', new Schema( {
    stat:       String,     // CharStat by name
    bonus:      Number
}));

var Benefit = mongoose.model('Benefit', new Schema( {
    name:       String,
    desc:       String,
    boost:      ObjectId,   // Boost
    inEffect:   Boolean,
    duration:   Number      // TODO: determine units
}));

var TechLevel = mongoose.model('TechLevel', new Schema( {
    biology:    Number,
    computer:   Number,
    nano:       Number
}));

var Item = mongoose.model('Item', new Schema( {
    name:       String,
    desc:       String,
    cost:       Number,
    sellPrice:  Number,
    dmgPrice:   Number,
    category:   String,
    techLevel:  ObjectId,   // TechLevel
    benefits:   Array       // array of Benefit
}));

var Belonging = mongoose.model('Belonging', new Schema( {
    amount:     Number,
    damaged:    Boolean,
    carried:    Boolean,
    item:       ObjectId    // Item
}));

var Mod = mongoose.model('Mod', new Schema( {
    name:       String,
    desc:       String,
    creditCost: Number,
    humanCost:  Number,
    prohibited: Array,      // array of Mod
    benefits:   Array,      // array of Benefit
    techLevel:  ObjectId    // TechLevel
}));

var CulturalStat = mongoose.model('CulturalStat', new Schema( {
    basic:      ObjectId,   // Basic
    level:      Number
}));


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
};

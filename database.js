
/*
 * Database Utility Routes
 */
module.exports = Database;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * Define models
 **/

var User = mongoose.model('User', new Schema( {
    first:      String,
    last:       String,
    email:      { type: String, unique: true },
    password:   { type: String, index: true }
}));

var CharStat = mongoose.model('CharStat', new Schema( {
    name:       String,
    desc:       String,
    currentLvl: Number,
    maxLevel:   Number
}));

var Basic = mongoose.model('Basic', new Schema( {
    name:       String,
    desc:       String
}));

var Profession = mongoose.model('Profession', new Schema( {
    name:       String,
    desc:       String,
    specialty:  String,
    level:      Number
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

var Homeland = mongoose.model('Homeland', new Schema( {
    name:       String,
    desc:       String,
    world:      ObjectId,   // Basic
    techLevel:  ObjectId,   // TechLevel
    profs:      Array,      // array of Professions
    controls:   Array,      // array of CulturalStat
    memes:      Array,      // array of CulturalStat
    legals:     Array       // array of CulturalStat
}));

var Character = mongoose.model('Character', new Schema( {
    name:       String,
    humanity:   Number,
    credits:    Number,
    nous:       ObjectId,   // CharStat
    soma:       ObjectId,   // CharStat
    racialType: ObjectId,   // Basic
    profession: ObjectId,   // Profression
    history:    Array,      // array of History
    belongings: Array,      // array of Belonging
    owner:      ObjectId    // User
}));


function Database () {
    mongoose.connect('mongodb://127.0.0.1/transhuman-0');
    return this;
};

Database.prototype.createAccount = function( req, res, next) {
    var user = new User(req.body.user).save( function(err) {
        if( err) return next(err);
        next();
    });
};

Database.prototype.loginAttempt = function( req, res, next) {
    User.findOne( {  email: req.body.user.email
                   , password: req.body.user.password }, function( err, doc)
    {
        if( err) return next(err);
        if( !doc) {
            req.session.loggedIn = null;
        } else {
            req.session.loggedIn = doc._id.toHexString();
        }
        
        next();
    });
};

Database.prototype.authMiddleware = function( req, res, next) {
    if( req.session.loggedIn) {
        res.locals.authenticated = true;
        User.findById( req.session.loggedIn, function( err, doc) {
            if( err) return next(err);
            res.locals.me = doc;
            next();
        });
    } else {
        res.locals.authenticated = false;
        next();
    }
};

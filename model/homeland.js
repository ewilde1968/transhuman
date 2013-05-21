
/*
 * Homeland model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Profession = require('./profession');

var HomelandSchema = new Schema( {
    name:       { type: String, index: true},
    desc:       String,
    world:      { type: String, index: true},   // World by name
    techLevel:  Array,      // TechLevel
    profs:      Array,      // array of Professions
    controls:   Array,      // array of CulturalStat
    memes:      Array,      // array of CulturalStat
    legals:     Array       // array of CulturalStat
});

HomelandSchema.defaultData = [
    {
        name: 'US Orbital Station',
        desc: 'US Orbital Station',
        world: 'Mercury',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station'
    },
    {
        name: 'Quebec South Pole Research',
        desc: 'Quebec South Pole Research',
        world: 'Mercury',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet'
    },
    {
        name: 'China Orbital Station',
        desc: 'China Orbital Station',
        world: 'Venus',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station'
    },
    {
        name: 'European Orbital Station',
        desc: 'European Orbital Station',
        world: 'Venus',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station'
    },
    {
        name: 'US',
        desc: 'US',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City'
    },
    {
        name: 'Europe',
        desc: 'Europe',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City'
    },
    {
        name: 'China',
        desc: 'China',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City'
    },
    {
        name: 'Virgin Interplanetary Spaceport',
        desc: 'Virgin Interplanetary Spaceport',
        world: 'Low Earth Orbit',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'High China',
        desc: 'High China',
        world: 'Low Earth Orbit',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'Bigelow L4 Estates',
        desc: 'Bigelow L4 Estates',
        world: 'Lagrange IV',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'US Naval Depot',
        desc: 'US Naval Depot',
        world: 'Lagrange IV',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'Outzone Zion',
        desc: 'Outzone Zion',
        world: 'Lagrange V',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet'
    },
    {
        name: 'Plymouth Rock',
        desc: 'Plymouth Rock',
        world: 'Lagrange V',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet'
    },
    {
        name: 'European Heavy Hydrogen',
        desc: 'European Heavy Hydrogen',
        world: 'Luna',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'Shackleton Crater',
        desc: 'Shackleton Crater',
        world: 'Luna',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial City'
    },
    {
        name: 'PRC Naval Depot, Phobos',
        desc: 'PRC Naval Depot, Phobos',
        world: 'Mars',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village'
    },
    {
        name: 'New Beijing',
        desc: 'New Beijing',
        world: 'Mars',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial City'
    }
];


HomelandSchema.statics.initializeDB = function() {
    Homeland.findOne( {}, function(err,doc) {
        if( !doc) {
            // no current Homelands exist, initialize
            HomelandSchema.defaultData.forEach( function(homeland) {
                // rewrite the profession type with the professions array
                homeland.profs = Profession.getAvailableProfessions( homeland.profs);

                var h = new Homeland( homeland).save( function(err) {
                    if(err) return next(err);
                });
            });
        }
    });
};

HomelandSchema.statics.getArrayOfWorld = function(world, callback) {
    Homeland.find( {world:world}, function(err,docs) {
        if(err) return next(err);
        callback(docs);
    });
};

var Homeland = mongoose.model('Homeland', HomelandSchema);
module.exports = Homeland;

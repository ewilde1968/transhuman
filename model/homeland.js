
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
    techLevel:  { biology: Number, compSci: Number, nanoTech: Number},      // TechLevel
    profs:      Array,      // array of Professions
    culture:    Array,      // array of CulturalStat (meme, controls)
    race:       Object      // dictionary of races with their legal status
});

HomelandSchema.defaultData = [
    {
        name: 'US Orbital Station',
        desc: 'US Orbital Station',
        world: 'Mercury',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Quebec South Pole Research',
        desc: 'Quebec South Pole Research',
        world: 'Mercury',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'China Orbital Station',
        desc: 'China Orbital Station',
        world: 'Venus',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'European Orbital Station',
        desc: 'European Orbital Station',
        world: 'Venus',           // default data uses string, lookup ID at init time
        profs: 'Orbital Station',
        techLevel: { biology: 9, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'US',
        desc: 'US',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City',
        techLevel: { biology: 9, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Europe',
        desc: 'Europe',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'China',
        desc: 'China',
        world: 'Earth',           // default data uses string, lookup ID at init time
        profs: 'Earth City',
        techLevel: { biology: 9, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Virgin Interplanetary Spaceport',
        desc: 'Virgin Interplanetary Spaceport',
        world: 'Low Earth Orbit',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'High China',
        desc: 'High China',
        world: 'Low Earth Orbit',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Bigelow L4 Estates',
        desc: 'Bigelow L4 Estates',
        world: 'Lagrange IV',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 9, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'US Naval Depot',
        desc: 'US Naval Depot',
        world: 'Lagrange IV',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 9, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Outzone Zion',
        desc: 'Outzone Zion',
        world: 'Lagrange V',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet',
        techLevel: { biology: 9, compSci: 8, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 9 },
                   { name: 'Post-Labor', level: 7 },
                   { name: 'Humanism', level: 2 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Plymouth Rock',
        desc: 'Plymouth Rock is a barren asteroid rich in precious minerals. It was hauled to Lagrange V and extensively mined before being abandoned. Settlers wanting a life of freedom from religious persecution have reinforced the existing rock structure and sealed off large sections to contain an atmosphere and extensive hydroponic system.',
        world: 'Lagrange V',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Hamlet',
        techLevel: { biology: 8, compSci: 8, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Limited agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'European Heavy Hydrogen',
        desc: 'European Heavy Hydrogen',
        world: 'Luna',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 8, compSci: 8, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'Shackleton Crater',
        desc: 'Shackleton Crater',
        world: 'Luna',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial City',
        techLevel: { biology: 8, compSci: 9, nanoTech: 8},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'PRC Naval Depot, Phobos',
        desc: 'PRC Naval Depot, Phobos',
        world: 'Mars',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial Village',
        techLevel: { biology: 8, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    },
    {
        name: 'New Beijing',
        desc: 'New Beijing',
        world: 'Mars',           // default data uses string, lookup ID at init time
        profs: 'Extraterrestrial City',
        techLevel: { biology: 9, compSci: 9, nanoTech: 9},
        culture: [ { name: 'Hyperevolution', level: 6 },
                   { name: 'Post-Labor', level: 3 },
                   { name: 'Humanism', level: 5 }
                 ],
        race: { Human: 'Independent agency',
                Cybershell: 'Property',
                Biogen: 'Independent agency',
                Uplift: 'Limited agency'
              }
    }
];


HomelandSchema.statics.initializeDB = function() {
    Homeland.findOne( {}, function(err,doc) {
        if( !doc) {
            // no current Homelands exist, initialize
            HomelandSchema.defaultData.forEach( function(homeland) {
                try {
                    // rewrite the profession type with the professions array
                    homeland.profs = Profession.getAvailableProfessions( homeland.profs);

                    var h = new Homeland( homeland).save( function(err) {
                        if(err) return next(err);
                    });
                } catch(tErr) {
                    tErr += ' in homeland ' + homeland.name;
                    throw tErr;
                }
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

HomelandSchema.statics.findByName = function(world, homeland, callback) {
    Homeland.findOne( {world:world,name:homeland}, function(err, result) {
        if(err) return next(err);
        
        callback( result);
    });
};

var Homeland = mongoose.model('Homeland', HomelandSchema);
module.exports = Homeland;

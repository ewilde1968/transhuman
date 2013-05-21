
/*
 * World model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Homeland = require('./homeland');

var WorldSchema = new Schema( {
    name:       { type: String, unique: true},
    desc:       String
});

WorldSchema.defaultData = [
    {
        name: 'Mercury',
        desc: 'Small, low gravity planet with no atmosphere and resonably valuable minerals.'
    },
    {
        name: 'Venus',
        desc: 'Scorchingly hot, high density and corrosive atmosphere.'
    },
    {
        name: 'Earth',
        desc: 'Mother Earth, the center of human activity.'
    },
    {
        name: 'Low Earth Orbit',
        desc: 'A hive of activity, with shipyards and research labs sprinkling a dense population of satellites old and new.'
    },
    {
        name: 'Lagrange IV',
        desc: 'Hi end, off earth living.'
    },
    {
        name: 'Lagrange V',
        desc: 'Low rent, cobbled together, barely sustainable floating communities.'
    },
    {
        name: 'Luna',
        desc: 'Most fourth and fifth wave nations have a  presence here.'
    },
    {
        name: 'Mars',
        desc: 'Dominated by China and the US.'
    }
];


WorldSchema.statics.initializeDB = function() {
    World.findOne( {}, function(err,doc) {
        if( !doc) {
            // no current Worlds exist, initialize
            WorldSchema.defaultData.forEach( function(world) {
                var w = new World( world).save( function(err) {
                    if(err) return next(err);
                });
            });
        }

        Homeland.initializeDB();
    });
};

WorldSchema.statics.getArray = function(callback) {
    World.find( {}, function(err,docs) {
        if(err) return next(err);
        if(callback) callback(docs);
        return;
    });
};

var World = mongoose.model('World', WorldSchema);
module.exports = World;


/*
 * Character model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Profession = require('./profession'),
    Homeland = require('./homeland'),
    Mod = require('./mod'),
    CharStat = require('./charstat');

var CharacterSchema = new Schema( {
    name:       {type: String, index: true},
    humanity:   Number,
    credits:    Number,
    nous:       [CharStat],   // CharStat
    soma:       [CharStat],   // CharStat
    racialType: ObjectId,   // Basic
    profession: [Profession],   // Profression
    mods:       Array,      // Array of Mods
    history:    Array,      // array of History
    belongings: Array,      // array of Belonging
    homeland:   ObjectId,   // Homeland
    owner:      { type: ObjectId, index: true}    // User
});


CharacterSchema.statics.createCharacter = function( req, res, next) {
    // first, delete the existing new character
    if( req.session.newCharacter)
        Character.remove( {_id:req.session.newCharacter});

    var newCharacter = new Character({owner: req.session.loggedIn});
    newCharacter.save( function(err) {
        if( err) {
            req.session.newCharacter = null;
            return next(err);
        }
        
        next();
    });

    req.session.newCharacter = newCharacter._id;
};

CharacterSchema.statics.setHomeland = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);

        Homeland.findOne({world:req.body.world, name:req.body.locale}, function(err,homeland) {
            if(err) return next(err);

            character.homeland = homeland._id;
            character.save();
            
            next();
        });
    });
};

CharacterSchema.statics.setProfession = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);

        character.profession.name = req.body.prof;
        character.profession.desc = Profession.getProfessionDescription( req.body.prof);
        character.profession.level = -1;
        character.profession.specialty = req.body.specialty;
        character.save( function(err) {
            if(err) return next(err);

            next();
        });
    });
};

CharacterSchema.statics.setStats = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);

        character.soma.name = 'Soma'
        character.soma.desc = CharStat.getDescriptionFromName( character.soma.name);
        character.soma.maxLevel = req.body.soma;
        character.soma.currentLvl = req.body.soma;
        
        character.nous.name = 'Nous'
        character.nous.desc = CharStat.getDescriptionFromName( character.nous.name);
        character.nous.maxLevel = 10 - req.body.soma;
        character.nous.currentLvl = 10 - req.body.soma;
        
        character.humanity = (req.body.soma > 5) ? req.body.soma : (10 - req.body.soma);
        character.profession.level = character.humanity;
        character.credits = 10000;

        character.save( function(err) {
            if(err) return next(err);

            next();
        });
    });
};

CharacterSchema.statics.setMods = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);
        
        // reconstruct the mod objects and save the ids
        req.body.result.split(',').forEach( function(elem, index, arr) {
            // get the mod by name and add it to the character
            Mod.findOne({name:elem}, function(err,mod) {
                if(err) return next(err);
                if( !character.mods)
                    character.mods = new Array();
                character.mods.push(mod);   // push the whole object
                
                // reduce the humanity and credits appropriately
                character.humanity -= mod.humanCost;
                character.credits -= mod.creditCost;

                // if this is the last element, save the character
                if( index == arr.length - 1) {
                    character.save( function(err) {
                        if(err) return next(err);
                        next();
                    });
                }
            });
        });
    });
};

var Character = mongoose.model('Character', CharacterSchema);
module.exports = Character;
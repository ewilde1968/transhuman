
/*
 * Character model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Profession = require('./profession'),
    Homeland = require('./homeland');

var CharacterSchema = new Schema( {
    name:       {type: String, index: true},
    humanity:   Number,
    credits:    Number,
    nous:       ObjectId,   // CharStat
    soma:       ObjectId,   // CharStat
    racialType: ObjectId,   // Basic
    profession: [Profession],   // Profression
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

var Character = mongoose.model('Character', CharacterSchema);
module.exports = Character;

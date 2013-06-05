
/*
 * Character model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Profession = require('./profession'),
    Homeland = require('./homeland'),
    Mod = require('./mod'),
    Item = require('./item'),
    Belonging = require('./belonging');

var CharacterSchema = new Schema( {
    name:       {type: String, index: true},
    humanity:   Number,
    credits:    Number,
    nous:       { currentLevel:Number, maxLevel:Number, desc:String},
    soma:       { currentLevel:Number, maxLevel:Number, desc:String},
    race: String,
    profession: { name:String, desc:String, level:Number, specialty:String},
    mods:       Array,      // Array of Mods
    history:    Array,      // array of { name, desc, date }
    belongings: Array,      // array of Belonging
    homeland:   { type: ObjectId, index: true},   // Homeland
    owner:      { type: ObjectId, index: true}    // User
});


CharacterSchema.statics.getByOwnerId = function( ownerID, callback) {
    Character.find( {owner: ownerID},
                    'name profession',
                    function( err, characters) {
                        if(err) return next(err);
                        callback( characters);
                    });
};

CharacterSchema.statics.createCharacter = function( req, res, next) {
    // first, delete the existing new character
    if( req.session.newCharacter) {
        Character.remove( {_id:req.session.newCharacter}).exec();
    }

    var newCharacter = new Character({owner: req.session.loggedIn,
                                      race: 'Human',
                                      name: 'unnamed'});
    newCharacter.save( function(err) {
        if( err) {
            req.session.newCharacter = null;
            return next(err);
        }
        
        next();
    });

    req.session.newCharacter = newCharacter._id;
};

CharacterSchema.statics.cancelCharacter = function( req, res, next) {
    // first, delete the existing new character
    if( req.session.newCharacter)
        Character.remove( {_id:req.session.newCharacter}, function(err) {
            req.session.newCharacter = null;
            if( err)
                return next(err);
            next();
            });
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

var roundOff = function(x) {
    return Math.round(x*100)/100;
};

CharacterSchema.statics.setStats = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);

        character.soma.maxLevel = req.body.soma;
        character.soma.currentLevel = req.body.soma;
        
        character.nous.maxLevel = 10 - req.body.soma;
        character.nous.currentLevel = 10 - req.body.soma;
        
        character.humanity = (req.body.soma > 5) ? req.body.soma : (10 - req.body.soma);
        character.profession.level = character.humanity;
        character.credits = 10000;

        character.save( function(err) {
            if(err) return next(err);

            next();
        });
    });
};

CharacterSchema.statics.setModById = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        Mod.findById( req.params.modid, function(err, mod) {
            if(err) return next(err);
        
            if( 'sell' == req.body.transaction) {
                for( var i = 0; i < character.mods.length; i++) {
                    if( character.mods[i].name == mod.name) {
                        character.mods.splice( i, 1);

                        // add the humanity and credits to the character's total
                        character.humanity = Math.round(( character.humanity + mod.humanCost)*100)/100;
                        character.credits = Math.round(( character.credits + mod.creditCost)*100)/100;
                    }
                }
            } else {
                for( var i = 0; i < character.mods.length; i++) {
                    if( character.mods[i].name == mod.name) {
                        next();
                        return; // already have this mod, stop
                    }
                }
                character.mods.push(mod);

                // subtract the humanity and credits to the character's total
                character.humanity = Math.round(( character.humanity - mod.humanCost)*100)/100;
                character.credits = Math.round(( character.credits - mod.creditCost)*100)/100;
            }

            character.save( function(err) {
                if(err) return next(err);
                next();
            });
        });
    });
};

CharacterSchema.statics.setItemById = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        Item.findById( req.params.itemid, function(err, item) {
            if(err) return next(err);
        
            if( 'sell' == req.body.transaction) {
                for( var i = 0; i < character.belongings.length; i++) {
                    if( character.belongings[i].item.name == item.name) {
                        var amountSold = character.belongings[i].amount - req.body.amount;

                        character.belongings[i].amount = req.body.amount;
                        character.credits = Math.round(( character.credits + item.cost*amountSold)*100)/100;

                        if( 0 == character.belongings[i].amount)
                            character.belongings.splice( i, 1);
                    }
                }
            } else {
                var amountBought = req.body.amount;
                for( var i = 0; i < character.belongings.length; i++) {
                    if( character.belongings[i].item.name == item.name) {
                        amountBought = req.body.amount - character.belongings[i].amount;
                        character.belongings[i].amount = req.body.amount;
                    }
                }
                if( amountBought == req.body.amount)
                    character.addBelonging( item, amountBought);

                character.credits = Math.round(( character.credits - item.cost*amountBought)*100)/100;
            }

            character.save( function(err) {
                if(err) return next(err);
                next();
            });
        });
    });
};

CharacterSchema.statics.setDetails = function( req, res, next) {
    Character.findById( req.session.newCharacter, function(err, character) {
        if(err) return next(err);
        
        character.soma.desc = req.body.soma;
        character.nous.desc = req.body.nous;
        character.name = req.body.characterName;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.statics.changeName = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        character.name = req.body.nameTE;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.statics.changeSoma = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        character.soma.currentLevel = req.body.current;
        character.soma.maxLevel = req.body.max;
        character.soma.desc = req.body.desc;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.statics.changeNous = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        character.nous.currentLevel = req.body.current;
        character.nous.maxLevel = req.body.max;
        character.nous.desc = req.body.desc;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.statics.changeProfession = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        character.profession.specialty = req.body.specialty;
        character.profession.level = req.body.level;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.statics.changeHumanity = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);
        
        character.humanity = req.body.level;

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};


CharacterSchema.statics.setHistory = function( req, res, next) {
    Character.findById( req.params.id, function(err, character) {
        if(err) return next(err);

        var history = { name: req.body.nameTE,
                        desc: req.body.descTA,
                        datetime: req.body.dateTE };
        var found = false;
        for( var index = 0; index < character.history.length; index++) {
            if( character.history[index].name == req.params.historyname) {
                found = true;
                break;
            }
        }

        if( !found)
            character.history.push( history);
        else
            character.history.splice( index, 1, history);

        character.save( function(err) {
            if(err) return next(err);
            next();
        });
    });
};

CharacterSchema.methods.getBelonging = function( itemObj) {
    if( this.belongings) {
        this.belongings.forEach( function(elem) {
            if( itemObj.isEqual( elem.item))
                return elem;
        });
    }
    
    return null;
}

CharacterSchema.methods.addBelonging = function(itemObj, amount) {
    var b = this.getBelonging(itemObj);
    if( null == b) {
        b = Belonging.create( itemObj, amount);
        if( !this.belongings)
            this.belongings = new Array();
        this.belongings.push( b);
    } else {
        b.amount++;
    }
};

CharacterSchema.methods.getModsByType = function() {
    var result = new Array();

    // iterate through all the owned mods, creating new type dicts
    for( var i = 0; i < this.mods.length; i++) {
        var modObj = this.mods[i];
        
        var found = false;
        for( var j=0;j<result.length;j++) {
            if( result[j][0].type == modObj.type) {
                found = true;
                result[j].push( modObj);
                break;
            }
        }
        if( !found) {
            var newArray = new Array();
            newArray.push( modObj);
            result.push( newArray);
        }
    }
    
    return result;
};

CharacterSchema.methods.getItemsByType = function() {
    var result = new Array();

    // iterate through all the owned mods, creating new type dicts
    for( var i = 0; i < this.belongings.length; i++) {
        var belongingObj = this.belongings[i];
        
        var found = false;
        for( var j=0;j<result.length;j++) {
            if( result[j][0].type == belongingObj.item.category) {
                found = true;
                result[j].push( belongingObj);
                break;
            }
        }
        if( !found) {
            var newArray = new Array();
            newArray.push( belongingObj);
            result.push( newArray);
        }
    }
    
    return result;
};

CharacterSchema.methods.getHistory = function( historyname) {
    if( historyname && this.history) {
        for( var i = 0; i < this.history.length; i++) {
            if( this.history[i].name == historyname)
                return this.history[i];
        }
    }
    
    return null;
};

var Character = mongoose.model('Character', CharacterSchema);
module.exports = Character;

/*
 * GET home page.
 */

var mongoose = require('mongoose'),
    Character = require('./../model/character'),
    Homeland = require('./../model/homeland'),
    Mod = require('./../model/mod'),
    Item = require('./../model/item');

exports.index = function(req, res){
    if( res.locals.authenticated) {
        res.redirect('/user/' + req.session.loggedIn);
    } else {
        res.render('index', { signupEmail: req.params.signupEmail || false });
    }
};

exports.loginAttempt = function(req, res) {
    if( res.locals.authenticated) {
        res.redirect('/user/' + req.session.loggedIn);
    } else {
        res.send( '<p>User not found. Go back and try again</p>');
    }
};

exports.logout = function(req, res){
    req.session.loggedIn = null;
    res.redirect('/');
};

exports.signup = function(req, res){
    res.render('signup');
};

exports.createdAccount = function( req, res, next) {
    res.redirect('/login/' + req.body.user.email);
};

exports.user = function( req, res, next) {
    if( req.session.loggedIn == req.params.id) {
        Character.getByOwnerId( req.session.loggedIn, function(cList) {
            res.render('user', {characters:cList});
        });
    } else {
        res.redirect('/');
    }
};

exports.wizardChooseHomeland = function( req, res, next) {
    res.render('wizardchoosehomeland', {defaultWorld:"'Earth'",
                                        defaultHomeland:"'US'"});
};

exports.wizardChooseHomelandDetail = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Homeland.findByName( req.params.world, req.params.homeland, function(homeland) {
                var url = '/wizard/choosehomeland';
                res.render('homeland', {
                    character: character,
                    homeland: homeland,
                    doneURL: url
                });
            });
        });
    }
};

exports.wizardSetHomeland = function( req, res, next) {
    res.redirect('/wizard/chooseprofession');
};

exports.wizardChooseProfession = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Homeland.findById(character.homeland, function(err,homeland) {
                if(err) return next(err);

                res.render('wizardchooseprofession', {professions:homeland.profs});
            });
        });
    }
};

exports.wizardSetProfession = function( req, res, next) {
    res.redirect('/wizard/choosestats');
};

exports.wizardChooseStats = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else
        res.render('wizardchoosestats');    
};

exports.wizardSetStats = function( req, res, next) {
    res.redirect('/wizard/choosemods');
};

exports.wizardChooseMods = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Mod.generateListByType( function(docs) {
                res.render('mods', {
                    character: character,
                    mods: docs,
                    cancelURL: '/wizard/cancel',
                    formURL:  '/wizard/choosemods'
                });
            });
        });
    }
};

exports.wizardChooseModsDetail = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Mod.findByName( req.params.mod, function(mod) {
                var owned = false;
                var eligible = character.humanity >= mod.humanCost
                            && character.credits >= mod.creditCost;
                
                for( var i=0;i<character.mods.length;i++) {
                    var cMod = character.mods[i];
                    if( cMod.name == mod.name) {
                        owned = true;
                        eligible = true;
                    } else {
                        if( eligible) {
                            for( var j=0;j<cMod.prohibited.length;j++) {
                                if( cMod.prohibited[j] == mod.name) {
                                    eligible = false;
                                    break;
                                }
                            }
                        }
                    }
                }

                res.render('mod', {
                    character: character,
                    mod: mod,
                    eligible: eligible,
                    owned: owned,
                    doneURL: '/wizard/choosemods'
                });
            });
        });
    }
};

exports.wizardSetMods = function( req, res, next) {
    res.redirect('/wizard/chooseitems');
};

exports.wizardChooseItems = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Item.generateListByType( function(docs) {
                res.render('items', {
                    character: character,
                    mods: docs,
                    cancelURL: '/wizard/cancel',
                    formURL: '/wizard/chooseitems'
                });
            });
        });
    }
};

exports.wizardChooseItemsDetail = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            Item.findByName( req.params.item, function(item) {
                var owned = 0;
                var eligible = character.credits >= item.cost;
                
                for( var i=0;i<character.belongings.length;i++) {
                    if( character.belongings[i].item.name == item.name) {
                        owned = character.belongings[i].amount;
                        eligible = true;
                    }
                }

                res.render('item', {
                    character: character,
                    item: item,
                    eligible: eligible,
                    owned: owned,
                    doneURL: '/wizard/chooseitems'
                });
            });
        });
    }
};

exports.wizardSetItems = function( req, res, next) {
    res.redirect('/wizard/choosedetails');
};

exports.wizardChooseDetails = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        Character.findById(req.session.newCharacter, function(err,character) {
            if(err) return next(err);
        
            res.render('wizardchoosedetails', {
                nous: character.nous.currentLevel,
                soma: character.soma.currentLevel
            });
        });
    }
};

exports.wizardSetDetails = function( req, res, next) {
    // clean up the newCharacter object and direct to its homepage
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        var charPage = '/character/' + req.session.newCharacter;
        req.session.newCharacter = null;    // don't remove from database, its done
        
        res.redirect(charPage);
    }
};

exports.character = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        Homeland.findById( character.homeland, function(err,homeland) {
            if(err) return next(err);
            
            res.render('character', {
                character: character,
                homeland: homeland
            });
        });
    });
};

exports.name = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('name', {
                character: character
        });
    });
};

exports.changeName = function( req, res, next) {
    res.redirect( '/character/' + req.params.id);
};

exports.homeland = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        Homeland.findById( character.homeland, function(err,homeland) {
            if(err) return next(err);
            
            res.render('homeland', {
                character: character,
                homeland: homeland,
                doneURL: '/character/' + req.params.id
            });
        });
    });
};

exports.race = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        Homeland.findById( character.homeland, function(err,homeland) {
            if(err) return next(err);
            
            res.render('race', {
                character: character,
                homeland: homeland
            });
        });
    });
};

exports.soma = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('stat', {
                character: character,
                stat: 'soma',
                statStr: 'Soma'
        });
    });
};

exports.nous = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('stat', {
                character: character,
                stat: 'nous',
                statStr: 'Nous'
        });
    });
};

exports.profession = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('profession', {
            character: character
        });
    });
};

exports.humanity = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('humanity', {
            character: character
        });
    });
};

exports.mods = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        var ownedMods = character.getModsByType(); 
        res.render('ownedmods', {
            character: character,
            ownedMods: ownedMods
        });
    });
};

exports.setModById = function( req, res, next) {
    // posted a mod sell or buy action, go to doneURL
    res.redirect(req.body.doneURL);
};

exports.modDetail = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
            if(err) return next(err);
        
            Mod.findByName( req.params.modname, function(mod) {
                var owned = false;
                var eligible = character.humanity >= mod.humanCost
                            && character.credits >= mod.creditCost;
                
                for( var i=0;i<character.mods.length;i++) {
                    if( character.mods[i].name == mod.name) {
                        owned = true;
                        eligible = true;
                    } else {
                        if( eligible) {
                            for( var j=0;j<mod.prohibited.length;j++) {
                                if( mod.prohibited[j] == mod.name) {
                                    eligible = false;
                                    break;
                                }
                            }
                        }
                    }
                }

                res.render('mod', {
                    character: character,
                    mod: mod,
                    eligible: eligible,
                    owned: owned,
                    doneURL: '/character/' + character._id + '/mods'
                });
            });
        });

};

exports.buyMods = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        Mod.generateListByType( function(docs) {
            res.render('mods', {
                character: character,
                mods: docs,
                cancelURL: '/character/' + character._id + '/mods',
                formURL:  null
            });
        });
    });
};

exports.items = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        var ownedItems = character.getItemsByType(); 
        res.render('owneditems', {
            character: character,
            ownedItems: ownedItems
        });
    });
};

exports.setItemById = function( req, res, next) {
    // posted an item sell or buy action, go to doneURL
    res.redirect(req.body.doneURL);
};

exports.itemDetail = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
            if(err) return next(err);
        
            Item.findByName( req.params.itemname, function(item) {
                var owned = false;
                var eligible = character.credits >= item.cost;
                
                for( var i=0;i<character.belongings.length;i++) {
                    if( character.belongings[i].item.name == item.name) {
                        owned = character.belongings[i].amount;
                        eligible = true;
                    }
                }

                res.render('item', {
                    character: character,
                    item: item,
                    eligible: eligible,
                    owned: owned,
                    doneURL: '/character/' + character._id + '/items'
                });
            });
        });

};

exports.buyItems = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        Item.generateListByType( function(docs) {
            res.render('items', {
                character: character,
                mods: docs,
                cancelURL: '/character/' + character._id + '/items',
                formURL: null
            });
        });
    });
};

exports.histories = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('histories', {
            character: character
        });
    });
};

exports.history = function( req, res, next) {
    Character.findById(req.params.id, function(err,character) {
        if(err) return next(err);
        
        res.render('history', {
            character: character,
            history: character.getHistory( req.params.historyname)
        });
    });
};

exports.setHistory = function( req, res, next) {
    res.redirect( '/character/' + req.params.id + '/histories');
};

exports.deleteCharacter = function( req, res, next) {
    res.redirect( '/');
};
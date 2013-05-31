
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
                res.render('wizardchoosemods', {
                    humanity: character.humanity,
                    credits: character.credits,
                    mods: docs
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
                res.render('wizardchooseitems', {
                    credits: character.credits,
                    mods: docs
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
                homeland: homeland
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

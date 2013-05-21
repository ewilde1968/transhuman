
/*
 * GET home page.
 */

var mongoose = require('mongoose'),
    Character = require('./../model/character'),
    Homeland = require('./../model/homeland');

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
        res.render('user');
    } else {
        res.redirect('/');
    }
};

exports.wizardChooseHomeland = function( req, res, next) {
    res.render('wizardchoosehomeland', {defaultWorld:"'Earth'",
                                        defaultHomeland:"'US'"});
};

exports.wizardSetHomeland = function( req, res, next) {
    next();
    //res.redirect('/wizard/chooseprofession');
};

exports.wizardChooseProfession = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');

    Character.findById(req.session.newCharacter, function(err,character) {
        if(err) return next(err);
        
        Homeland.findById(character.homeland, function(err,homeland) {
            if(err) return next(err);
        
            res.render('wizardchooseprofession', {professions:homeland.profs});
        });
    });
};

exports.wizardSaveProfession = function( req, res, next) {
    req.session.newCharacter.setProfession(req.body.prof);
    
    res.redirect('/wizard/choosestats');
};

exports.wizardChooseStats = function( req, res, next) {
    if( !req.session.newCharacter)
        res.redirect('/');
    else {
        req.session.newCharacter.humanity = 5.0;
    }

    res.render('wizardchoosestats');    
};
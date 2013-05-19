
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { signupEmail: req.params.signupEmail || false });
};

exports.loginAttempt = function(req, res) {
    if( req.session.loggedIn) {
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
    res.render('user');
};

var homelands = [ {body: "Mercury", locales: ["US Orbital Station", "Quebec South Pole Research"]},
                 { body: "Venus", locales: ["China Orbital Station", "European Orbital Station"]},
                 { body: "Earth", locales: ["US", "Europe", "China"]},
                 { body: "Mars", locales: ["Pheobus", "New Beijing"]}
                ];
var worldArr = new Array( homelands.length);
for( var i=0;i<homelands.length;i++) worldArr[i] = homelands[i].body;
var localeArr = new Array( homelands.length);
for( i=0;i<homelands.length;i++) localeArr[i] = '["' + homelands[i].locales.join('","') + '"]';

exports.createWizHome = function( req, res, next) {
    res.render('createwizhome', {worldSrc: worldArr,
                                 defaultWorld: 'Earth',
                                 localeSrc: localeArr,
                                 homelands: homelands
                                });
};

exports.createWizHomeNext = function( req, res, next) {
    
};
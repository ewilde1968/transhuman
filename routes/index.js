
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.login = function(req, res){
  res.render('login', { signupEmail: false });
};

exports.loginPrepop = function(req, res) {
    res.render('login', { signupEmail: req.params.signupEmail });
};

exports.loginAttempt = function(req, res) {
    if( req.session.loggedIn) {
        res.redirect('/');
    } else {
        res.send( '<p>User not found. Go back and try again</p>');
    }
};

exports.logout = function(req, res){
    req.session.loggedIn = null;
    res.redirect('/');
};

exports.signup = function(req, res){
  res.render('signup', { title: 'Mongo User' });
};

exports.createdAccount = function( req, res, next) {
    res.redirect('/login/' + req.body.user.email);
};

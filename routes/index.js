
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
}

/*
 * User model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema( {
    first:      String,
    last:       String,
    email:      { type: String, unique: true },
    password:   { type: String, index: true }
});


var logIn = function(res, req, userID) {
    res.locals.authenticated = userID != null;
    req.session.loggedIn = userID;
};

UserSchema.statics.createAccount = function( req, res, next) {
    var user = new User(req.body.user).save( function(err) {
        if( err) return next(err);
        next();
    });
};

UserSchema.statics.loginAttempt = function( req, res, next) {
    User.findOne( {  email: req.body.user.email
                   , password: req.body.user.password }, function( err, doc)
    {
        if( err) return next(err);
        logIn( res, req, (doc != null) ? doc._id.toHexString() : null);
        
        next();
    });
};

UserSchema.statics.authMiddleware = function( req, res, next) {
    logIn( res, req, req.session.loggedIn);
    next();
};

UserSchema.statics.secure = function( req, res, next) {
    if( !res.locals.authenticated)
        res.redirect('/');
    else
        next();
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

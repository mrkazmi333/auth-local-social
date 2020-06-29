const passport = require('passport');
const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

//Authentication using passport .
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done){
        //Find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
               req.flash('error', err);
                return done(err);
            }
            if(!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        });
    }

));

//Serualie the user t decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//Deserializing the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log("Error in finding user ---> Passport");
            return done(err);
        }
        return done(null, user);
    });
});

//Check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    //i fthe user is signed in, then pass on the request to the next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from session cookie and we are just sending this to the
        //locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
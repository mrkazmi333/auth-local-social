const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "46728355361-set787a2cmoc7r16425s99bvl2lmlnmr.apps.googleusercontent.com",
        clientSecret: "UqXiXX7-QQH2Za7jApFKF85U",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google strategy passport', err);
                return;
            }
            console.log(profile);

            if(user){
                //if found set thi suser as req.user
                return done(null, user);
            }else{
                //if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('error in creating user through google oauth2', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }

));

module.exports = passport;


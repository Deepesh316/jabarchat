'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id); // Saving user id in the session
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {

        // Network or Internet connection error
         if(err) {
             return done(err);
         }

        if(user) {
            return done(null, false, req.flash('error', 'User with email already exist'));
        }

        // Creating new instance of user and save it to database

        var newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(function(err) {
            if(err){
                //console.log(err);
                return;
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {

        // Network or Internet connection error
        if(err) {
            return done(err);
        }

        //const  messages = [];
        // if (!user || !user.validUserPassword(password)) {
        //     messages.push('Email doesnot exist or Password is Invalid');
        //     return done(null, false, req.flash('error', messages));
        // }

        // if no user is found, return the message
        if (!user)
        return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    // if the user is found but the password is wrong
    if (!user.validUserPassword(password))
        return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // If email and password are valid
        return done(null, user);
    });
}));
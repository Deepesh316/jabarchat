'use strict';

module.exports = function(_ , passport, User) { // pass in lodash instead of requiring that module

        // Return Objects
        return {
            SetRouting: function(router) {
                router.get('/', this.indexPage);
                router.get('/signup', this.getSignUp);
                router.get('/home', this.homePage);
                
                router.post('/', User.LoginValidation, passport.authenticate('local.login', {
                    successRedirect: '/home',
                    failureRedirect: '/',
                    failureFlash: true
                }));

                //router.post('/signup', User.SignUpValidation, this.postSignUp);
                router.post('/signup', User.SignUpValidation, passport.authenticate('local.signup', {
                    successRedirect : '/home', // redirect to the secure profile section
                    failureRedirect : '/signup', // redirect back to the signup page if there is an error
                    failureFlash : true // allow flash messages
                }));

            },

            indexPage: function(req, res) {
                const errors = req.flash('error');
                return res.render('index', { title: 'JaberChat | Login ', messages: errors, hasErrors: errors.length > 0 });
            },

            getSignUp: function(req, res) {
                const errors = req.flash('error');
                return res.render('signup', { title: 'JaberChat | SignUp ', messages: errors, hasErrors: errors.length > 0 });
            },

            homePage: function(req, res) {
                return res.render('home');
            }
        }
}
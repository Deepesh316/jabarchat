'use strict';

module.exports = function(_ , passport, User) { // pass in lodash instead of requiring that module

        // Return Objects
        return {
            SetRouting: function(router) {
                router.get('/', this.indexPage);
                router.get('/signup', this.getSignUp);
                router.get('/home', this.homePage);
                
                router.post('/', User.LoginValidation, this.postLogin);
                router.post('/signup', User.SignUpValidation, this.postSignUp);

            },

            indexPage: function(req, res) {
                const errors = req.flash('error');
                return res.render('index', { title: 'JaberChat | Login ', messages: errors, hasErrors: errors.length > 0 });
            },

            postLogin : passport.authenticate('local.login', {
                successRedirect: '/home',
                failureRedirect: '/',
                failureFlash: true
            }),

            getSignUp: function(req, res) {
                const errors = req.flash('error');
                return res.render('signup', { title: 'JaberChat | SignUp ', messages: errors, hasErrors: errors.length > 0 });
            },

            postSignUp : passport.authenticate('local.signup', {
                successRedirect : '/home', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }),

            homePage: function(req, res) {
                return res.render('home');
            }
        }
}
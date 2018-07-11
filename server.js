const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
//const passport = require('passport');

const container = require('./container');



// Resolve a dependency and use it
container.resolve(function(users, _) {

    mongoose.Promise = global.Promise;
    //mongoose.set('debug', true);
    mongoose.connect('mongodb://localhost:27017/jaberchat', { useNewUrlParser: true });
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function() {
            console.log('Listening on port 3000');
        });

        ConfigureExpress(app);

        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }

    
    // All the configurations used in this project will be added here (passport, ejs, body-parser etc...)
    function ConfigureExpress(app) {

        require('./passport/passport-local');
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({
            secret: 'buymeacupofcoffee',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection}) // Data will be saved in the db even if user refresh the page
        }));

        app.use(flash());

        // In an Express-based application, passport.initialize() middleware is required to initialize Passport. If your application uses persistent login sessions, passport.session() middleware must also be used.
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _; // Set as global variable so that we can use it in ejs file
    }
});




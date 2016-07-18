// For Oauth2, See https://github.com/lelylan/simple-oauth2#express-and-github-example

var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

// File load
var views = require('./routes/view');
var goldens = require('./routes/golden');
var users = require('./routes/user');
var results = require('./routes/result');
var login = require('./routes/login');

// Security layer:
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var session = require( 'express-session' );  //Create a session middleware with the given options.

var GOOGLE_CLIENT_ID      = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET  = process.env.GOOGLE_CLIENT_SECRET;

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serialisation:", user);
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
    console.log("deserialisation: ",obj);
    // Not sure what to do with this yet.
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8010/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // --> Here we have the profile, but the Next dosent pass it???? It get lost somewhere. Where can it endup in the res.user? 
      return done(null, profile);
    });
  }
));

app.use( session({ 
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// GET /auth/google
app.get('/auth/google', 
  passport.authenticate('google', {scope: ['profile', 'email']})
);

// GET /auth/google/callback
app.get( '/auth/google/callback',
        passport.authenticate( 'google', { 
            successRedirect: '/',
            failureRedirect: '/login'
    }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
// End of the security layer


// App itself
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));



// API Routing
app.use('/api/view', ensureAuthenticated, views);
app.use('/api/golden', ensureAuthenticated, goldens);
app.use('/api/user', ensureAuthenticated, users);
app.use('/api/result', ensureAuthenticated, results);
app.use('/', login);
app.use('/login', login);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


app.set('port', process.env.PORT || 8010);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
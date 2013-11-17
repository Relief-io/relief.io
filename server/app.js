
var path = require( 'path' );
var express = require( 'express' );
var flash = require( 'connect-flash' );
var config = require('../config' );
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , GoogleStrategy = require('passport-google').Strategy;

// Express
app = express();
app.set( 'env', 'development' );
app.set( 'port', config['http.port'] );
app.set( 'baseDir', path.resolve( __dirname + '/..' ) );

// Static route should come before authentication
app.use( '/', express.static( app.get( 'baseDir' ) + '/public' ) );

// Authentication
passport.use(new FacebookStrategy({
    clientID: config['sso.facebookAppId'],
    clientSecret: config['sso.facebookAppSecret'],
    callbackURL: config['sso.facebookCallbackURL']
  },
  function(accessToken, refreshToken, profile, done) {
      done(null, profile);
      //mongo guys, do lookup based on profile facebook id and return user or err string if one does not exist
    /*User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
  }
));

passport.use(new TwitterStrategy({
    consumerKey: config['sso.twitterAppId'],
    consumerSecret: config['sso.twitterAppSecret'],
    callbackURL: config['sso.twitterCallbackURL']
  },
  function(token, tokenSecret, profile, done) {
      //mongo guys, do lookup based on profile facebook id and return user or err string if one does not exist
      done(null, profile);
    /*User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
  }
));

passport.use(new GoogleStrategy({
    returnURL: config['sso.googleCallbackURL'],
    realm: config['sso.googleRealm']
  },
  function(identifier, profile, done) {
      profile.id = '1234'; //stub this in for now, assuming mongo user will have a real user id
      done(null, profile);
    /*User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });*/
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, {"id":"1033993546","username":"gregory.ray.969","displayName":"Gregory Ray","name":{"familyName":"Ray","givenName":"Gregory"},"gender":"male","profileUrl":"https://www.facebook.com/gregory.ray.969","provider":"facebook","_raw":"{\"id\":\"1033993546\",\"name\":\"Gregory Ray\",\"first_name\":\"Gregory\",\"last_name\":\"Ray\",\"link\":\"https:\\/\\/www.facebook.com\\/gregory.ray.969\",\"username\":\"gregory.ray.969\",\"hometown\":{\"id\":\"104022926303756\",\"name\":\"Palo Alto, California\"},\"location\":{\"id\":\"106078429431815\",\"name\":\"London, United Kingdom\"},\"quotes\":\"This is Sparta!\",\"work\":[{\"employer\":{\"id\":\"240109879473164\",\"name\":\"Ever Adventure, Ltd.\"},\"location\":{\"id\":\"106078429431815\",\"name\":\"London, United Kingdom\"},\"position\":{\"id\":\"106324149403234\",\"name\":\"Co-founder\"},\"description\":\"Disrupting the 40bn online gambling industry.\",\"start_date\":\"0000-00\"},{\"employer\":{\"id\":\"37116701807\",\"name\":\"Tapulous\"},\"location\":{\"id\":\"104022926303756\",\"name\":\"Palo Alto, California\"},\"position\":{\"id\":\"137922119580780\",\"name\":\"Senior Software Developer\"},\"start_date\":\"2008-01-01\",\"end_date\":\"2010-01-01\"},{\"employer\":{\"id\":\"11784025953\",\"name\":\"Disney\"},\"start_date\":\"0000-00\",\"end_date\":\"0000-00\"},{\"employer\":{\"id\":\"404121553044292\",\"name\":\"FeZo. Fraking EZ, Okay?\"},\"location\":{\"id\":\"104022926303756\",\"name\":\"Palo Alto, California\"},\"position\":{\"id\":\"147416865300121\",\"name\":\"President\"},\"description\":\"Tools for creating game and applications for web and mobile.\",\"start_date\":\"0000-00\",\"end_date\":\"0000-00\"},{\"employer\":{\"id\":\"169544683231181\",\"name\":\"SocialGenius, Inc.\"}}],\"favorite_athletes\":[{\"id\":\"224607397702477\",\"name\":\"Team Paul\"}],\"education\":[{\"school\":{\"id\":\"115333988481585\",\"name\":\"Tooele High\"},\"type\":\"High School\"}],\"gender\":\"male\",\"timezone\":2,\"locale\":\"en_US\",\"verified\":true,\"updated_time\":\"2013-10-28T18:25:28+0000\"}","_json":{"id":"1033993546","name":"Gregory Ray","first_name":"Gregory","last_name":"Ray","link":"https://www.facebook.com/gregory.ray.969","username":"gregory.ray.969","hometown":{"id":"104022926303756","name":"Palo Alto, California"},"location":{"id":"106078429431815","name":"London, United Kingdom"},"quotes":"This is Sparta!","work":[{"employer":{"id":"240109879473164","name":"Ever Adventure, Ltd."},"location":{"id":"106078429431815","name":"London, United Kingdom"},"position":{"id":"106324149403234","name":"Co-founder"},"description":"Disrupting the 40bn online gambling industry.","start_date":"0000-00"},{"employer":{"id":"37116701807","name":"Tapulous"},"location":{"id":"104022926303756","name":"Palo Alto, California"},"position":{"id":"137922119580780","name":"Senior Software Developer"},"start_date":"2008-01-01","end_date":"2010-01-01"},{"employer":{"id":"11784025953","name":"Disney"},"start_date":"0000-00","end_date":"0000-00"},{"employer":{"id":"404121553044292","name":"FeZo. Fraking EZ, Okay?"},"location":{"id":"104022926303756","name":"Palo Alto, California"},"position":{"id":"147416865300121","name":"President"},"description":"Tools for creating game and applications for web and mobile.","start_date":"0000-00","end_date":"0000-00"},{"employer":{"id":"169544683231181","name":"SocialGenius, Inc."}}],"favorite_athletes":[{"id":"224607397702477","name":"Team Paul"}],"education":[{"school":{"id":"115333988481585","name":"Tooele High"},"type":"High School"}],"gender":"male","timezone":2,"locale":"en_US","verified":true,"updated_time":"2013-10-28T18:25:28+0000"}})
    //mongo guys, do lookup based on profile facebook id and return user or err string if one does not exist
  /*User.findById(id, function(err, user) {
    done(err, user);
  });*/
});

// app.use( express.logger() );
app.use( express.cookieParser() );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.session({ secret: 'fsdffsdfsdfsfsdfd' }));
app.use( flash() );
app.configure(function(){
  app.use(function(req, res, next){
    res.locals.config = {};
    res.locals.config['firebase.host'] = config['firebase.host'];
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next){
     res.locals.user = req.user;
     next();
  });
});

// Templating
app.set( 'views', app.get( 'baseDir' ) + '/public' ); 
app.set( 'view engine', 'jade' );
app.set( 'view options', { layout: false } );

// Routes
app.get( '/', function( req, res ){ res.render( 'index' ); });
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
passport.authenticate('twitter', { successRedirect: '/',
                                   failureRedirect: '/login' }));
// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return', 
 passport.authenticate('google', { successRedirect: '/',
                                   failureRedirect: '/login' }));
                                       
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Controllers
require( './controllers/example' )( app );

// Services
require( './sockets/twitter' );

// We're up & running!
app.listen( config['http.port'] );
console.log( "Server running in env %s on port %d", app.get( 'env' ), app.get( 'port' ) );
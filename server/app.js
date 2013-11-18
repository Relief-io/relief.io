
var path = require( 'path' )
  , express = require( 'express' )
  , flash = require( 'connect-flash' )
  , config = require('../config' )
  , passport = require('passport');

// Express
app = express();
app.set( 'env', 'development' );
app.set( 'port', config['http.port'] );
app.set( 'baseDir', path.resolve( __dirname + '/..' ) );

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


// Static route should come before authentication
app.use( '/', express.static( app.get( 'baseDir' ) + '/public' ) );

// Controllers
require( './controllers/example' )( app );
require( './controllers/passport' )( app, config, passport);

// Services
require( './sockets/twitter' );

// We're up & running!
app.listen( config['http.port'] );
console.log( "Server running in env %s on port %d", app.get( 'env' ), app.get( 'port' ) );
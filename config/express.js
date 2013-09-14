var express = require('express')
  , path    = require('path')

module.exports = function(app, config) {

  app.configure(function() {

    // should be placed before express.static
    app.use(express.compress({
      filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
      },
      level: 9
    }));

    if (config.env === 'development') {
      app.use(express.static(config.root + '/public'));
    }
    // app.set('port', config.port);
    // app.set('views', config.root + '/app/views');
    // app.set('view engine', 'jade');

    app.use(express.favicon(config.root + '/public/images/favicon.ico'));
    // don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
      app.use(express.logger('dev')); // see more: http://cl.ly/REvL
    }

    // cookieParser should be above session
    app.use(express.cookieParser(config.secret_token));

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Express cookie session should be above CSRF protection middleware
    app.use(express.cookieSession());

    // Telling CSRF middleware to use the right token
    var csrfValue = function(req) {
      var token = (req.body && req.body._csrf)
      || (req.query && req.query._csrf)
      || (req.headers['x-csrf-token'])
      || (req.headers['x-xsrf-token'])
      return token
    };

    // this should be ignored when running on test environment
    if (process.env.NODE_ENV !== 'test') {
      app.use(express.csrf({value: csrfValue}));
    }

    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.session._csrf)
        next()
    });

    // routes should be at the last
    app.use(app.router);

    app.use(function (err, req, res, next) {
      if (err.message === '401') {
        res.send(401);
      };
      next();
    });

    // // assume "not found" in the error msgs
    // // is a 404. this is somewhat silly, but
    // // valid, you can do whatever you like, set
    // // properties, use instanceof etc.
    // app.use(function(err, req, res, next){
    //   // treat as 404
    //   if (err.message
    //     && (~err.message.indexOf('not found')
    //     || (~err.message.indexOf('Cast to ObjectId failed')))) {
    //     return next()
    //   }

    //   // log it
    //   // send emails if you want
    //   console.error(err.stack)

    //   // error page
    //   res.status(500).render('500', { error: err.stack })
    // })

    // // assume 404 since no middleware responded
    // app.use(function(req, res, next){
    //   res.status(404).render('404', {
    //     url: req.originalUrl,
    //     error: 'Not found'
    //   })
    // })

  })
}


/**
 * WebTools - Routes
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose  = require('mongoose')

  , User      = mongoose.model('User')

  // require controllers
  , users     = require('../app/controllers/users')
  , resources = require('../app/controllers/resources')
  , types     = require('../app/controllers/types')
  , uploads    = require('../app/controllers/uploads')
  , sessions  = require('../app/controllers/sessions')
  , comments  = require('../app/controllers/comments');

/**
 * Expose routes
 */

module.exports = function(app) {

  app.get('/resources', function (req, res) {
    res.redirect('/#/resources');
  });
  app.get('/resources/:id', function(req, res, next) {
    res.redirect('/#/resources/' + req.param('id'));
  });
  app.get('/admin', function(req, res, next) {
    res.redirect('/#/admin');
  });
  app.get('/users/:id', function(req, res, next) {
    res.redirect('/#/users/' + req.param('id'));
  });

  /**
   * TypesController
   */

  app.get('/api/types', types.index);
  app.post('/api/types', isAuthenticated, requireAdmin, types.create); // TODO: add test

  /**
   * SessionsController
   */

  app.post('/api/sessions', sessions.create);

  /**
   * UsersController
   */

  app.post('/api/users', users.create);

  /**
   * ResourcesController
   */

  app.get('/api/resources', resources.index);
  app.get('/api/resources/:id', resources.show);
  app.post('/api/resources', isAuthenticated, resources.create); // TODO: add test

  /**
   * UploadsController
   */

  app.post('/api/resources/image', isAuthenticated, uploads.uploadImage);

  /**
   * CommentsController
   */

  app.get('/api/comments', comments.index);
  app.get('/api/resources/:resourceId/comments', comments.index)
  app.post('/api/comments', isAuthenticated, comments.create);

}

function isAuthenticated(req, res, next) {

  var remember_token = req.signedCookies['remember_token']

  if (remember_token) {
    User.findUserByRememberToken(remember_token, function(err, user) {

      if (err) { return next(err) }
      next()

    })
  }
  else {
    next(new Error(401));
  }

}

function requireAdmin(req, res, next) {

  var remember_token = req.signedCookies['remember_token']

  if (remember_token) {
    User.findUserByRememberToken(remember_token, function(err, user) {

      if (err) { return next(err)}
      if (user.role == 'admin') { next() }
      else { res.send({message: 'Could not authenticate you.'}) }

    })
  }
  else {
    next(new Error(401))
  }

}

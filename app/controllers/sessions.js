
/**
 * WebTools - SessionsController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , User     = mongoose.model('User')
  , sanitize = require('validator').sanitize

/**
 * Handle user login
 */
exports.create = function(req, res, next) {

  var login = sanitize(req.body.username).trim()
    , login = sanitize(login).xss()
    , login = login.toLowerCase()

  var password = sanitize(req.body.password).trim()
    , password = sanitize(password).xss()

  var remember_token = req.signedCookies['remember_token']

  if (!!remember_token) {

    User.findUserByRememberToken(remember_token, function(err, user) {

      if (err) { return next(err) }

      if (user) {
        res.send({
          "login": user.login,
          "role": user.role,
          "id": user._id,
          "update_at": user.update_at,
          "create_at": user.create_at
        })
      }
      else {
        res.send(401, 'Incorrect username or password.')
      }
    })

  }
  else if (!!login && !!password) {

    User.getUserByLogin(login, function(err, user) {

      if (err) { return next(err) }

      if (user && user.authenticate(password)) {
        res.cookie('remember_token', user.remember_token, { signed: true })
        res.send({
          "login": user.login,
          "id": user._id,
          "role": user.role,
          "update_at": user.update_at,
          "create_at": user.create_at
        })
      }
      else {
        res.send(401, 'Incorrect username or password.')
      }

    })

  }
  else {
    res.send(401);
  }

}

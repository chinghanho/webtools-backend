
/**
 * WebTools - UsersController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , User     = mongoose.model('User')
  , sanitize = require('validator').sanitize;

/**
 * Create
 */

exports.create = function(req, res, next) {

  var login = sanitize(req.body.username).trim()
    , login = sanitize(login).xss()
    , login = login.toLowerCase();

  var password = sanitize(req.body.password).trim()
    , password = sanitize(password).xss();

  var user = new User();

  user.newAndSave(login, password, function(err, user) {

    if (!!err) {
      if (err.code == 11000) {
        res.send(403, 'Username is already taken.');
      }
      else {
        res.send(403);
      }
      return next(err);
    }

    res.cookie('remember_token', user.remember_token, { signed: true })
    res.send({
      "login": user.login,
      "role": user.role,
      "id": user._id,
      "update_at": user.update_at,
      "create_at": user.create_at
    });

  });
}

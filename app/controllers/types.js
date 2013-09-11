
/**
 * WebTools - TypesController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Type     = mongoose.model('Type')
  , sanitize = require('validator').sanitize

/**
 * List
 */

exports.index = function(req, res, next) {

  Type.list({}, function(err, data) {
    res.send(data)
  });

}

/**
 * Create
 */

exports.create = function(req, res, next) {

  var name = sanitize(req.body.name).trim()
    , name = sanitize(name).xss()

  var _type = new Type()

  _type.newAndSave(name, function(err, type) {

    if (err) {
      console.error(err)
      if (err.code == 11000)
        res.send(403, 'Duplicate type name')
      return next(err)
    }
    else if (!type) {
      var err_msg = "Type not saved"
      res.send(403, err_msg)
      return next(new Error(err_msg))
    }

    res.send(type)

  })

}

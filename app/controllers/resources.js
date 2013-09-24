
/**
 * WebTools - ResourcesController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Resource = mongoose.model('Resource')
  , Type     = mongoose.model('Type')
  , sanitize = require('validator').sanitize;

/**
 * List
 */

exports.index = function(req, res, next) {

  var page = req.query.page || 1;

  var options = {
    page: page, // pagination
    per_page: 24 // items per page
  };

  Resource.list(options, function(err, data) {
    res.send(data);
  });

};

/**
 * Show
 */

exports.show = function (req, res, next) {
  Resource.getResourceById(req.params.id, function (err, resource) {
    res.send(resource);
  });
};

/**
 * Create
 */

exports.create = function(req, res, next) {

  var name = sanitize(req.body.name).trim()
    , name = sanitize(name).xss();

  var description = sanitize(req.body.description).trim()
    , description = sanitize(description).xss();

  var img_url = sanitize(req.body.img_url).trim()
    , img_url = sanitize(img_url).xss();

  var url = sanitize(req.body.url).trim()
    , url = sanitize(url).xss();

  var type = sanitize(req.body.type).trim()
    , type = sanitize(type).xss();

  var resource = new Resource();

  resource.newAndSave(name, description, img_url, url, type, function(err, resource) {

    if (err) {
      console.error(err);
      if (err.code == 11000) {
        res.send(403, 'Duplicate resource name.');
      }
      return next(err);
    }
    else if (!resource) {
      var err_msg = "Resource not saved";
      res.send(403, err_msg);
      return next(new Error(err_msg));
    }

    Type.getTypeById(req.body.type, function(err, type) {
      type.resources_count += 1;
      type.save();

      Resource.getResourceById(resource._id, function(err, resource) {
        res.send(resource);
      });
    });

  });
};


/**
 * WebTools - UploadsController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var fs     = require('fs')
  , path   = require('path')
  , im     = require('imagemagick')
  , config = require('../../config/config')
  , mkdirp = require('mkdirp');

exports.uploadImage = function(req, res, next) {

  if (!req.files) {
    res.send({ status: 'failed', message: 'no file' });
    return;
  }

  var file         = req.files.file
    , filename     = file.name
    , new_filename = Date.now() + '_' + filename;

  var old_path  = file.path
    , save_path = path.resolve(config.upload_dir);

  mkdirp(save_path, function (err) {

    im.crop({
      srcPath: old_path,
      dstPath: save_path + '/' + new_filename,
      width: 650,
      height: 300,
      quality: 1,
      gravity: "Center"
    }, function(err, stdout, stderr) {
      if (err) throw err;
      var url = '/system/uploads/pictures/resources' + encodeURIComponent(new_filename);
      res.send({ status: 'success', url: url });
    });

  })

};

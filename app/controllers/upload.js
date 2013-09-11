
/**
 * WebTools - UploadsController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

var fs = require('fs')
  , path = require('path')
  , im = require('imagemagick');

exports.uploadImage = function(req, res, next) {

  if (!req.files) {
    res.send({ status: 'failed', message: 'no file' });
    return;
  }

  var file = req.files.file
    , filename = file.name
    , new_filename = Date.now() + '_' + filename;

  var old_path = file.path
    , save_path = path.resolve(__dirname, '../../public', './uploads/pictures/resources') + '/' + new_filename;

  im.crop({
    srcPath: old_path,
    dstPath: save_path,
    width: 650,
    height: 300,
    quality: 1,
    gravity: "Center"
  }, function(err, stdout, stderr) {
    if (err) throw err;
    console.log('crop image to fit within 650x300px. :)');

    var url = '/uploads/pictures/resources/' + new_filename;
    res.send({ status: 'success', url: url });
  });

}

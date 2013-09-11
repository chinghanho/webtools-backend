var express  = require('express')
  , mongoose = require('mongoose')
  , fs       = require('fs')
  , path     = require('path')
  , config   = require('./config/config');

// Bootstrap db connection
mongoose.connect(config.db.url, config.db.options, function(err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

var app = express();
// express settings
require('./config/express')(app, config);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
app.listen(config.port);

// expose app
exports = module.exports = app;

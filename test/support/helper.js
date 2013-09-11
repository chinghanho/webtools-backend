exports.sign_in = function(agent) {
  return function(done) {
    agent.post('/api/sessions')
      .send({login: 'foobar', password: '12345678'})
      .end(onResponse);

    function onResponse(err, res) {
      // TODO:
    }
  }
}

function sign_in(agent) {
  return function(done) {
    // body...
  }
}

// This helper is deprecated currently.

/**
 * Module dependencies
 */

// var mongoose = require('mongoose')
//   , async    = require('async')
//   , User     = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */
// exports.clearDb = function(done) {
//   async.parallel([
//     function(cb) {
//       User.remove(cb)
//     }
//   ], done);
// };

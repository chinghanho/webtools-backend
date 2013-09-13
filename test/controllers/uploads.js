
/**
 * WebTools - UploadsController tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var should   = require('should')
  , request  = require('supertest')
  , path     = require('path')
  , mongoose = require('mongoose')
  , exec     = require('child_process').exec

  // app should be above models
  , app      = require('../../app')
  , User     = mongoose.model('User')
  , agent    = request.agent(app);

var user, test_image_path;

describe('UploadsController', function() {

  before(function (done) {
    test_image_path = path.join(__dirname, '..', 'fixtures') + '/' + 'test.png';

    user = new User({
      login: 'foobar',
      password: '12345678'
    });

    user.save(done);
  });

  describe('POST /api/resources/image', function () {

    describe('for non-signed-user', function () {

      it('should respond 401', function (done) {
        agent.post('/api/resources/image')
          .attach('image', test_image_path)
          .expect(401)
          .end(done);
      });

    });

    describe('for signed-user', function () {

      context('with invalid parameters', function () {

        before(function (done) {
          agent.post('/api/sessions')
            .send({username: 'foobar', password: '12345678'})
            .end(done);
        });

        it('should respond status 200', function (done) {
          agent.post('/api/resources/image')
            .attach('file', test_image_path)
            .expect(200)
            .end(done);
        });

      });

    });

  });

  after(function (done) {
    User.remove(function () {
      exec('rm -rf .tmp', function (err) {
        if (err) { console.log('exec error: ' + err); }
        done(err);
      });
    });
  });

});

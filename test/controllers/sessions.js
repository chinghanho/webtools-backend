
/**
 * WebTools - SessionsController tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

 /**
  * Module dependencies
  */

var should   = require('should')
  , request  = require('supertest')
  , mongoose = require('mongoose')
  , _        = require('underscore')

  // app should be above models
  , app      = require('../../app')
  , User     = mongoose.model('User');

var user;

describe('SessionsController', function() {

  before(function(done) {
    user = new User({
      login: 'foobar',
      password: '12345678'
    });
    user.save(done);
  });

  describe('POST /api/sessions', function() {

    context('with valid parameters', function() {

      it('should respond 200', function(done) {
        request(app).post('/api/sessions')
          .send({username: 'foobar', password: '12345678'})
          .expect(200)
          .end(done);
      });

      it('should set remember_token in cookie', function(done) {
        request(app).post('/api/sessions')
          .send({username: 'foobar', password: '12345678'})
          .end(onResponse);

        function onResponse(err, res) {
          should.exist(res.headers['set-cookie']);

          var remember_token_cookie = _.filter(res.headers['set-cookie']
              , function(cookie) {
            if (cookie.indexOf(user.remember_token) != -1) {
              return cookie;
            }
          });

          remember_token_cookie.should.not.be.empty;
          done();
        }
      });

    });

    context('with invalid parameters', function() {

      it('should respond 401', function(done) {
        request(app).post('/api/sessions')
          .send({username: '', password: ''})
          .expect(401)
          .end(done);
      });

    });

  });

  after(function(done) {
    User.remove(done);
  });

});

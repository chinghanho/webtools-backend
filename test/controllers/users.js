
/**
 * WebTools - UsersController tests
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

  // app should be above User
  , app      = require('../../app')
  , User     = mongoose.model('User');

var count;

describe('UsersController', function() {

  describe('POST /api/users', function() {

    context('with valid parameters', function() {

      it('should respond the user data correctly', function(done) {
        request(app).post('/api/users')
          .set('Content-Type', 'application/json')
          .send({username: 'foobar', password: '12345678'})
          .expect(200)
          .end(onResponse);

        function onResponse(err, res) {
          _.size(res.body).should.equal(5);
            res.body.should.have.property('login', 'foobar');
            res.body.should.have.property('role', 'user');
            res.body.should.have.property('id');
            res.body.should.have.property('create_at');
            res.body.should.have.property('update_at');
          return done();
        }
      });

      before(function(done) {
        User.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should insert a record to the database', function(done) {
        User.count(function(err, cnt) {
          cnt.should.equal(count + 1);
          done();
        });
      });

    });

    context('with invalid parameters', function() {

      it('should respond 403', function(done) {
        request(app).post('/api/users')
          .set('Content-Type', 'application/json')
          .send({username: '', password: ''})
          .expect(403)
          .end(done);
      });

      before(function(done) {
        User.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should not insert a record to the database', function(done) {
        User.count(function(err, cnt) {
          count.should.equal(cnt);
          done();
        });
      });

    });

  });

  after(function(done) {
    User.remove(done);
  });

});

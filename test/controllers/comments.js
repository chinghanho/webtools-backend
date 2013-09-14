
/**
 * WebTools - CommentsController tests
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
  , Comment  = mongoose.model('Comment')
  , User     = mongoose.model('User')
  , Resource = mongoose.model('Resource')
  , agent    = request.agent(app);

var user, resource, body, user_id, resource_id;

describe('CommentsController', function() {

  before(function(done) {
    user = new User({
      login: 'foobar',
      password: '12345678'
    });

    resource = new Resource({
      description: 'foobar',
      img_url: '/images/foo.png',
      name: 'foobar',
      url: 'http://foo.bar'
    });

    user.save(function() {
      resource.save(done);
    });
  });

  describe('POST /api/comments', function() {

    context('for non-signed-in users', function() {

      it('should respond 401', function(done) {
        agent.post('/api/comments')
          .set('Content-Type', 'application/json')
          .send({user: user.id, body: 'foobar', resource: resource.id})
          .expect(401)
          .end(done);
      })

    });

    context('for signed-in users', function() {

      before(function(done) {
        agent.post('/api/sessions')
          .send({username: 'foobar', password: '12345678'})
          .end(done);
      });

      context('with valid parameters', function() {

        it('should respond the comment data correctly', function(done) {
          agent.post('/api/comments')
            .set('Content-Type', 'application/json')
            .send({user: user.id, body: 'foobar', resource: resource.id})
            .expect(200)
            .end(onResponse);

          function onResponse(err, res) {
            _.size(res.body).should.equal(6);
              res.body.should.have.property('body', 'foobar');
              res.body.should.have.property('user', user.id);
              res.body.should.have.property('resource', resource.id);
              res.body.should.have.property('id');
              res.body.should.have.property('create_at');
              res.body.should.have.property('update_at');
            return done();
          }
        });
      });

    });

  });

  describe('GET /api/comments', function () {

    beforeEach(function (done) {
      var comment = new Comment({
        body: 'foobar',
        user_id: user.id,
        resource_id: resource.id
      });
      comment.save(done);
    });

    it('should respond 200', function (done) {
      request(app).get('/api/comments')
        .expect(200)
        .end(done);
    });

    it('should get all comments as array', function (done) {
      request(app).get('/api/comments')
        .end(function (err, res) {
          res.body.should.be.an.instanceOf(Array);
          res.body[0].body.should.equal('foobar');
          done();
        });
    });

  });

  after(function(done) {
    User.remove(function() {
      Resource.remove(done);
    });
  });

  afterEach(function (done) {
    Comment.remove(done);
  });

});


/**
 * WebTools - Comment Model tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , should   = require('should')

  // app should be above Comment
  , app      = require('../../app')
  , Comment  = mongoose.model('Comment')
  , User     = mongoose.model('User')
  , Resource = mongoose.model('Resource')
  , context  = describe;

var comment, body, user, resource, count;

describe('Comment', function() {

  beforeEach(function() {
    body = 'foobar';
    resource = new Resource();
    user = new User();

    comment = new Comment({
      body: body,
      resource_id: resource,
      user_id: user
    });
  });

  afterEach(function(done) {
    Comment.remove(done);
  });

  describe('Schema', function() {
    it('should have these basic fields', function() {
      should.exist(Comment.schema.path('body'));
      should.exist(Comment.schema.path('user_id'));
      should.exist(Comment.schema.path('resource_id'));
      should.exist(Comment.schema.path('create_at'));
      should.exist(Comment.schema.path('update_at'));
    });
  });

  describe('Validator', function() {

    context('when body is not present', function() {
      it('should be invalid', function() {
        comment.body = '';
        comment.validate(function(err) {
          should.exist(err.errors.body);
        });
      });
    });

    context('when body is not trimmed', function() {
      it('should trim it', function() {
        Comment.schema.path('body')
          .applySetters(' foobar  ')
          .should.equal('foobar');
      });
    });

    context('when body length is more then 140 characters', function() {
      it('should be invalid', function() {
        // `new Array(141).join('a')` will generate 140 characters.
        // `new Array(142).join('a')` will generate 141 characters.
        // Try it on your node console.
        comment.body = new Array(142).join('a');
        comment.validate(function(err) {
          should.exist(err.errors.body);
        });
      });
    });

  });

  describe('Instance Method', function() {

    context('#newAndSave', function() {

      beforeEach(function(done) {
        Comment.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should create comment successfully with valid parameters', function(done) {
        comment.newAndSave(user, resource, body, function() {
          Comment.count(function(err, cnt) {
            cnt.should.equal(count + 1);
            done();
          });
        });
      });

    });

  });

});

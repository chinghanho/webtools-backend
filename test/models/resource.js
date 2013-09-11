
/**
 * WebTools - Resource Model tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , should   = require('should')

  // app should be above Resource
  , app      = require('../../app')
  , Resource = mongoose.model('Resource')
  , Type     = mongoose.model('Type')
  , context  = describe;

var resource, name, description, img_url, url, type_id, count;

describe('Resource', function() {

  beforeEach(function() {
    name        = 'foobar resource';
    description = 'foobar description';
    img_url     = '/images/foo.png';
    url         = 'http://foo.bar';
    type_id     = new Type();

    resource = new Resource({
      name: name,
      description: description,
      img_url: img_url,
      url: url,
      type_id: type_id
    });
  });

  afterEach(function(done) {
    Resource.remove(done);
  });

  describe('Schema', function() {
    it('should have these basic fields', function() {
      should.exist(Resource.schema.path('description'));
      should.exist(Resource.schema.path('img_url'));
      should.exist(Resource.schema.path('name'));
      should.exist(Resource.schema.path('url'));
      should.exist(Resource.schema.path('type_id'));
      should.exist(Resource.schema.path('user_id'));
      should.exist(Resource.schema.path('comments'));
      should.exist(Resource.schema.path('comments_count'));
      should.exist(Resource.schema.path('create_at'));
      should.exist(Resource.schema.path('update_at'));
    });
  });

  describe('Validator', function() {

    context('when description is not present', function() {
      it('should not be valid', function() {
        resource.description = '';
        resource.validate(function(err) {
          should.exist(err.errors.description);
        });
      });
    });

    context('when img_url is not present', function() {
      it('should not be valid', function() {
        resource.img_url = '';
        resource.validate(function(err) {
          should.exist(err.errors.img_url);
        });
      });
    });

    context('when name is not present', function() {
      it('should not be valid', function() {
        resource.name = '';
        resource.validate(function(err) {
          should.exist(err.errors.name);
        });
      });
    });

    context('when url is not present', function() {
      it('should not be valid', function() {
        resource.url = '';
        resource.validate(function(err) {
          should.exist(err.errors.url);
        });
      });
    });

    context('when name is not trimmed', function() {
      it('should trim it', function() {
        Resource.schema.path('name').applySetters('  what   ').should.equal('what');
      });
    });

    context('when description is not trimmed', function() {
      it('should trim it', function() {
        Resource.schema.path('description').applySetters('  what   ').should.equal('what');
      });
    });

  });

  describe('Instance Method', function() {

    context('#newAndSave', function() {

      beforeEach(function(done) {
        Resource.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should create resource successfully with valid parameters', function(done) {
        resource.newAndSave(name, description, img_url, url, type_id, function() {
          Resource.count(function(err, cnt) {
            cnt.should.equal(count + 1);
            done();
          });
        });
      });

      it('should create resources unsuccessfully with invalid parameters', function(done) {
        resource.newAndSave('', '', '', '', '', function() {
          Resource.count(function(err, cnt) {
            cnt.should.equal(count);
            done();
          });
        });
      });
    });

  });

  describe('Class Method', function() {

    beforeEach(function(done) {
      resource.save(function() {
        done();
      });
    });

    // context('#list', function() {
    //   it('should return resources list', function() {
    //     // TODO: check resources list
    //   });
    // });

    context('#getResourceById', function() {
      it('should return resource by id', function(done) {
        Resource.getResourceById(resource._id, function(err, _resource) {
          resource.id.should.equal(_resource.id);
          done();
        });
      });

      // TODO: test for populate type_id
    });

  });

});

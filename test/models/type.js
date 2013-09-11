
/**
 * WebTools - Type Model tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

var mongoose = require('mongoose')
  , should   = require('should')

  // app should be above Type
  , app     = require('../../app')
  , Type    = mongoose.model('Type')
  , context = describe;

var type, name, count;

describe('Type', function() {

  beforeEach(function() {
    name = 'foobar'

    type = new Type({
      name: name
    });
  });

  afterEach(function(done) {
    Type.remove(done);
  });

  describe('Schema', function() {

    it('should have these basic fields', function() {
      should.exist(Type.schema.path('name'));
      should.exist(Type.schema.path('resources'));
      should.exist(Type.schema.path('resources_count'));
      should.exist(Type.schema.path('create_at'));
    });

  });

  describe('Validator', function() {

    context('when name is not present', function() {
      it('should be invalid', function() {
        type.name = '';
        type.validate(function(err) {
          should.exist(err.errors.name);
        });
      });
    });

    context('when name is already taken', function() {
      it('should not be valid', function(done) {
        var type_with_same_name = new Type({
          name: name
        });

        type.save(function() {
          type_with_same_name.save(function(err, type) {
            err.code.should.equal(11000);
            done();
          });
        });
      });
    });

    context('when name is not trimmed', function() {
      it('should trim it', function() {
        Type.schema.path('name')
          .applySetters(' Foo Bar   ')
          .should.equal('Foo Bar');
      });
    });

  });

  describe('Instance Method', function() {

    context('#newAndSave', function() {

      before(function(done) {
        Type.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should create type successfully with valid parameters', function(done) {
        type.newAndSave(name, function(err, type) {
          Type.count(function(err, cnt) {
            cnt.should.equal(count + 1);
            done();
          });
        });
      });

      it('should create type unsuccessfully with invalid parameters', function(done) {
        type.newAndSave('', function() {
          Type.count(function(err, cnt) {
            cnt.should.equal(count);
            done();
          });
        });
      });
    });

  });

  describe('Class Method', function() {

    beforeEach(function(done) {
      type.save(done);
    });

    context('#getTypeById', function() {
      it('should get the type by id', function(done) {
        Type.getTypeById(type._id, function(err, _type) {
          type.id.should.equal(_type.id);
          done();
        });
      });
    });

    // context('#list', function() {
    //   it('should get types list', function() {
    //     // TODO: check types list
    //   });
    // });

  });

});


/**
 * WebTools - TypesController tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var should   = require('should')
  , request  = require('supertest')
  , mongoose = require('mongoose')

  // app should be above models
  , app      = require('../../app')
  , Type     = mongoose.model('Type');

var type;

describe('TypesController', function() {

  describe('GET /api/types', function() {

    before(function(done) {
      type = new Type({
        name: 'foobar'
      });

      type.save(done);
    });

    it('should should respond all types', function(done) {
      request(app).get('/api/types')
        .expect(200)
        .end(onResponse);

      function onResponse(err, res) {
        res.body.should.be.an.instanceOf(Array);
        res.body[0].name.should.equal(type.name);
        done();
      }
    });

  });

  after(function(done) {
    Type.remove(done);
  });

});

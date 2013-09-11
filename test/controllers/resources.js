
/**
 * WebTools - ResourcesController tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var should   = require('should')
  , request  = require('supertest')
  , mongoose = require('mongoose')

  // app should above Resource
  , app      = require('../../app')
  , Resource = mongoose.model('Resource')
  , User     = mongoose.model('User')
  , Type     = mongoose.model('Type');

describe('ResourcesController', function() {

  describe('GET /api/resources', function() {

    before(function(done) {
      var resource = new Resource({
        name: 'foobar',
        description: 'description foobar',
        img_url: '/images/foo.png',
        url: 'http://foo.bar'
      });
      resource.save(done);
    });

    it('should respond all resources', function(done) {
      request(app).get('/api/resources')
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.instanceOf(Array);
          res.body[0].name.should.equal('foobar');
          done();
        });
    });

  });

  after(function(done) {
    Resource.remove(done);
  });

});


/**
 * WebTools - User Model tests
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , should   = require('should')
  , bcrypt   = require('bcrypt')

  // app should be above User
  , app      = require('../../app')
  , User     = mongoose.model('User')
  , context  = describe;

var user, login, password, count;

describe('User', function() {

  beforeEach(function() {
    login    = 'foobar';
    password = '12345678';

    user = new User({
      login: login,
      password: password
    });
  });

  afterEach(function(done) {
    User.remove(done);
  });

  describe('Schema', function() {
    it('should have these basic fields', function() {
      should.exist(User.schema.path('email'));
      should.exist(User.schema.path('login'));
      should.exist(User.schema.path('name'));
      should.exist(User.schema.path('salt'));
      should.exist(User.schema.path('hashed_password'));
      should.exist(User.schema.path('role'));
      should.exist(User.schema.path('remember_token'));
      should.exist(User.schema.path('resources'));
      should.exist(User.schema.path('resources_count'));
      should.exist(User.schema.path('comments'));
      should.exist(User.schema.path('comments_count'));
      should.exist(User.schema.path('create_at'));
      should.exist(User.schema.path('update_at'));
    });

    it('should add virtuals for password field', function() {
      User.schema.virtualpath('password').should.exist;
    });

    it('added virtuals fields should have getters', function() {
      User.schema.virtualpath('password').getters.should.be.not.empty;
    });

    it('added virtuals fields should have setters', function() {
      User.schema.virtualpath('password').setters.should.be.not.empty;
    });

    context('when set the password', function() {
      it('should encrypt it to hashed_password', function() {
        user = new User();
        user.password = '12345678';
        should.exist(user.hashed_password);
      });
    });
  });

  describe('Validator', function() {

    context('when login is not present', function() {
      it('should not be valid', function() {
        user.login = '';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.login);
          }
          else {
            should.exist(err);
          }
        });
      });
    });

    context('when hashed_password is not present', function() {
      it('should not be valid', function() {
        user.hashed_password = '';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.hashed_password);
          }
          else {
            should.exist(err);
          }
        });
      });
    });

    context('when email format is invalid', function() {
      it('should not be valid with user@foo,bar', function() {
        user.email = 'user@foo,bar';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.email);
          }
          else {
            should.exist(err);
          }
        });
      });

      it('should not be valid with user@foo', function() {
        user.email = 'user@foo';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.email);
          }
          else {
            should.exist(err);
          }
        });
      });

      it('should not be valid with user.foo.bar', function() {
        user.email = 'user.foo.bar';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.email);
          }
          else {
            should.exist(err);
          }
        });
      });

      it('should not be valid with foo@bar+baz.com', function() {
        user.email = 'foo@bar+baz.com';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.email);
          }
          else {
            should.exist(err);
          }
        });
      });

      it('should not be valid with foo@bar_baz.com', function() {
        user.email = 'foo@bar_baz.com';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.email);
          }
          else {
            should.exist(err);
          }
        });
      });
    });

    context('when email format is valid', function() {
      it('should be valid with user@foo.bar', function() {
        user.email = 'user@foo.bar';
        user.validate(function(err) {
          if (!!err) {
            should.not.exist(err.errors.email);
          }
          else {
            should.not.exist(err);
          }
        });
      });
    });

    context('when remember_token is not present', function() {
      it('should not be valid', function(done) {
        // TODO: this test case is not good...
        user.save(function(err, user) {
          user.remember_token.should.not.be.empty;
          done();
        });
      });
    });

    context('when role is not present', function() {
      it('should not be valid', function() {
        user.role = '';
        user.validate(function(err) {
          if (!!err) {
            should.exist(err.errors.role);
          }
          else {
            should.exist(err);
          }
        });
      });
    });

    context('when email is already taken', function() {
      it('should not be valid', function(done) {
        var user_with_same_email = new User({
          login: 'newfoobar',
          password: '12345678',
          email: 'user@foo.bar'
        });

        user.email = 'user@foo.bar';
        user.save(function() {
          user_with_same_email.save(function(err) {
            if (!!err && !!err.code) {
              err.code.should.equal(11000);
            }
            else {
              should.exist(err.code);
            }
          });
          done();
        });
      });
    });

    context('when login is already taken', function() {
      it('should not be valid', function(done) {
        var user_with_same_login = new User({
          login: 'foobar',
          password: '12345678'
        });

        user.save(function(err, user) {
          user_with_same_login.save(function(err) {
            if (!!err && !!err.code) {
              err.code.should.equal(11000);
            }
            else {
              should.exist(err.code);
            }
          });
          done();
        });
      });
    });

    context('when name is not trimmed', function() {
      it('should trim it', function() {
        User.schema.path('name').applySetters('  what   ').should.equal('what');
      });
    });

    context('when login is not trimmed', function() {
      it('should trim it', function() {
        User.schema.path('login').applySetters('  what   ').should.equal('what');
      });
    });

    context('when email is not trimmed', function() {
      it('should trim it', function() {
        User.schema.path('email').applySetters('  what   ').should.equal('what');
      });
    });

    context('when email is not lowercase', function() {
      it('should convert it to lowercase', function() {
        User.schema.path('email').applySetters('UsEr@fOo.Bar').should.equal('user@foo.bar');
      });
    });

    context('when login is not lowercase', function() {
      it('should convert it to lowercase', function() {
        User.schema.path('login').applySetters('FooBar').should.equal('foobar');
      });
    });

  });

  describe('Instance Method', function() {

    context('#authenticate', function() {
      it('return true if passowrd is correctly', function(done) {
        user.save(function(err, user) {
          should.not.exist(err);
          user.authenticate(password).should.be.true;
          done();
        });
      });

      it('return false if password is not correctly', function(done) {
        user.save(function(err, user) {
          should.not.exist(err);
          user.authenticate(password + '123').should.be.false;
          done();
        });
      });
    });

    context('#newAndSave', function() {

      before(function(done) {
        User.count(function(err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should create user successfully with valid parameters', function(done) {
        user.newAndSave(login, password, function() {
          User.count(function(err, cnt) {
            cnt.should.equal(count + 1);
            done();
          });
        });
      });

      it('should create user unsuccessfully with invalid parameters', function(done) {
        user.newAndSave('', '', function() {
          User.count(function(err, cnt) {
            cnt.should.equal(count);
            done();
          });
        });
      });
    });

    context('#makeSalt', function() {
      it('should generate salt', function() {
        var salt = user.makeSalt()
          , split_salt = salt.split('$');
        salt.length.should.equal(29);
        split_salt[1].should.equal('2a');
        split_salt[2].should.equal('10');
      });
    });

    context('#encryptPassword', function() {
      it('should return bcrypted password', function() {
        var hash = user.encryptPassword(password)
          , bcrypted = bcrypt.hashSync(password, user.salt);
        hash.should.equal(bcrypted);
      });
    });

    context('#new_remember_token', function() {
      it('should generate remember_token string', function(done) {
        user.new_remember_token(function(token) {
          token.length.should.equal(64);
          done();
        });
      });
    });

  });

  describe('Class Method', function() {

    beforeEach(function(done) {
      user.save(done);
    });

    context('#getUserByLogin', function() {
      it('should find user by login', function(done) {
        User.getUserByLogin(login, function(err, _user) {
          _user.login.should.equal(user.login);
          done();
        });
      });
    });

    context('#findByUserId', function() {
      it('should find user by id', function(done) {
        User.findByUserId(user.id, function(err, _user) {
          _user.id.should.equal(user.id);
          done();
        });
      });
    });

    context('#findUserByRememberToken', function() {
      it('should find user by remember_token', function(done) {
        User.findUserByRememberToken(user.remember_token, function(err, _user) {
          _user.remember_token.should.equal(user.remember_token);
          done();
        });
      });
    });

  })

});

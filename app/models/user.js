
/**
 * WebTools - User Model
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose  = require('mongoose')
  , crypto    = require('crypto')
  , bcrypt    = require('bcrypt')
  , _         = require('underscore')
  , config    = require('../../config/config')
  , Validator = require('validator').Validator
  , validator = new Validator();

var Schema = mongoose.Schema;

/**
 * User Schema
 */

var UserSchema = new Schema(
  {
    name:             { type: String, trim: true },
    login:            { type: String, trim: true, lowercase: true, unique: true, required: true },
    salt:             { type: String },
    hashed_password:  { type: String, required: true },
    email:            { type: String, trim: true, lowercase: true, unique: true },
    role:             { type: String, default: 'user', required: true },
    remember_token:   { type: String, required: true },
    resources:       [{ type: Schema.ObjectId, index: true, ref: 'Resource' }],
    resources_count:  { type: Number, default: 0 },
    comments:        [{ type: Schema.ObjectId, index: true, ref: 'Comment' }],
    comments_count:   { type: Number, default: 0 },
    create_at:        { type: Date, default: Date.now },
    update_at:        { type: Date, default: Date.now }
  }
);

/**
 * Validations
 */

UserSchema.path('email').validate(function(email) {
  var VALID_EMAIL_REGEX = /^\w+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/;
  return VALID_EMAIL_REGEX.test(email);
}, 'Email is invalid');

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password });


/**
 * Hooks
 */

UserSchema.pre('validate', function(next) {
  var that = this;
  this.new_remember_token(function(remember_token) {
    that.remember_token = remember_token;
    next();
  });
});

UserSchema.pre('save', function(next) {
  if (_.contains(config.admin, this.login)) {
    this.role = 'admin';
    next();
  } else {
    next();
  }
});

/**
 * Methods (instance method)
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param  {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },

  newAndSave: function(login, password, callback) {
    this.login = login;
    this.password = password;
    this.save(callback);
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },

  /**
   * Encrypt password
   *
   * @param  {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      var bcrypted = bcrypt.hashSync(password, this.salt);
      return bcrypted;
    } catch (err) {
      console.error(err);
      return '';
    }
  },

  /**
   * Generate a random URL-safe token
   */
  new_remember_token: function(callback) {
    crypto.randomBytes(32, function(ex, buf) {
      callback(buf.toString('hex'));
    });
  }

};

/**
 * Statics (class method)
 */

UserSchema.statics = {

  /**
   * Get user by login
   * @param  {String}   login
   * @param  {Function} callback
   * @return {Object}            user
   */
  getUserByLogin: function(login, callback) {
    this.findOne({ login: login })
      .exec(callback);
  },

  findByUserId: function(id, callback) {
    this.findOne({ _id: id })
      .exec(callback);
  },

  findUserByRememberToken: function(remember_token, callback) {
    this.findOne({ remember_token: remember_token })
      .exec(callback);
  }

};

mongoose.model('User', UserSchema);

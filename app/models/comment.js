
/**
 * WebTools - Comment Model
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Comment Schema
 */

 var maxlength = [function(value) {
  var maximum = 140;
   return value.length <= maximum;
 }];

var CommentSchema = new Schema(
  {
    body:        { type: String, required: true, trim: true, validate: maxlength },
    user:        { type: Schema.ObjectId, index: true, ref: 'User' },
    resource:    { type: Schema.ObjectId, index: true, ref: 'Resource' },
    create_at:   { type: Date, default: Date.now },
    update_at:   { type: Date, default: Date.now }
  }
);

/**
 * Methods (instance method)
 */

CommentSchema.methods = {

  newAndSave: function(user, resource, body, callback) {
    this.user     = user;
    this.resource = resource;
    this.body     = body;
    this.save(callback);
  }

}

/**
 * Statics (class method)
 */

CommentSchema.statics = {

   /**
    * List
    *
    * @param  {Object} options
    * @param  {Function} callback
    * @api public
    */
  list: function(options, callback) {
    this.find(options)
      .populate('resource', 'name')
      .populate('user', 'login role')
      .exec(callback);
  }

};

mongoose.model('Comment', CommentSchema);

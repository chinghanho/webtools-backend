
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
    user_id:     { type: Schema.ObjectId, index: true, ref: 'User' },
    resource_id: { type: Schema.ObjectId, index: true, ref: 'Resource' },
    create_at:   { type: Date, default: Date.now },
    update_at:   { type: Date, default: Date.now }
  }
);

/**
 * Methods (instance method)
 */

CommentSchema.methods = {

  newAndSave: function(user, resource, body, callback) {
    this.user_id = user;
    this.resource_id = resource;
    this.body = body;
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
       .populate('resource_id', 'name')
       .populate('user_id', 'name')
       .exec(callback);
   },

   getCommentsByResourceId: function (resourceId, callback) {
     this.find({ resource_id: resourceId })
       .exec(callback);
   }

 };

mongoose.model('Comment', CommentSchema);

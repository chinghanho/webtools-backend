
/**
 * WebTools - Resource Model
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Resources Schema
 */

var ResourceSchema = new Schema(
  {
    description:    { type: String, trim: true, required: true },
    img_url:        { type: String, required: true },
    name:           { type: String, trim: true, required: true },
    url:            { type: String, required: true },
    type:           { type: Schema.ObjectId, index: true, ref: 'Type' },
    user:           { type: Schema.ObjectId, index: true, ref: 'User' },
    comments_count: { type: Number, default: 0 },
    create_at:      { type: Date, default: Date.now },
    update_at:      { type: Date, default: Date.now }
  }
);

/**
 * Methods (instance method)
 */

ResourceSchema.methods = {

  newAndSave: function(name, description, img_url, url, type, callback) {
    this.name        = name
    this.description = description
    this.img_url     = img_url
    this.url         = url
    this.type        = type
    this.save(callback)
  }

};

/**
 * Statics (class method)
 */

ResourceSchema.statics = {

  /**
   * List
   *
   * @param  {Object} options
   * @param  {Function} callback
   * @api public
   */
  list: function(options, callback) {
    this.find(options)
      .populate('type', 'name')
      .exec(callback);
  },

  /**
   * Get resource by id
   *
   * @param  {Number}   resource
   * @param  {Function} callback
   * @return {Object}               resource
   * @api public
   */
  getResourceById: function(resource, callback) {
    this.findOne({ _id: resource })
      .populate('type', 'name')
      .exec(callback);
  }

};

mongoose.model('Resource', ResourceSchema);

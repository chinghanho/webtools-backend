
/**
 * WebTools - Type Model
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

 /**
  * Module dependencies
  */

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

/**
 * Type Schema
 */

var TypeSchema = new Schema(
  {
    name:            { type: String, trim: true, unique: true, required: true },
    resources:      [{ type: Schema.ObjectId, index: true, ref: 'Resource' }],
    resources_count: { type: Number, default: 0 },
    create_at:       { type: Date, default: Date.now }
  }
);

/**
 * Methods (instance method)
 */

TypeSchema.methods = {

  newAndSave: function(name, callback) {
    this.name = name;
    this.save(callback);
  }

};

 /**
  * Statics (class method)
  */

TypeSchema.statics = {

  getTypeById: function(type_id, callback) {
    this.findOne({ _id: type_id })
      .exec(callback);
  },

  list: function(options, callback) {
    this.find(options)
      .exec(callback);
  }

};

mongoose.model('Type', TypeSchema);

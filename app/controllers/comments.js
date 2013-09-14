
/**
 * WebTools - CommentsController
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')
  , User = mongoose.model('User')
  , Resource = mongoose.model('Resource')
  , sanitize = require('validator').sanitize;

/**
 * Create
 */

exports.create = function(req, res, next) {

  var user = sanitize(req.body.user).trim()
    , user = sanitize(user).xss();

  var body = sanitize(req.body.body).trim()
    , body = sanitize(body).xss();

  var resource = sanitize(req.body.resource).trim()
    , resource = sanitize(resource).xss();

  var comment = new Comment();

  comment.newAndSave(user, resource, body, function(err, _comment) {

    if (!!err) {
      console.error(err);
      var err_msg = "Comment not saved";
      res.send(403, err_msg);
      return next(new Error(err_msg));
    }

    User.findByUserId(user, function(err, user) {
      user.comments.push(_comment);
      user.comments_count += 1;
      user.save(function() {
        Resource.getResourceById(resource, function(err, resource) {
          resource.comments.push(_comment);
          resource.comments_count += 1;
          resource.save();
        });
        res.json({
          body: _comment.body,
          user: _comment.user_id,
          resource: _comment.resource_id,
          id: _comment.id,
          create_at: _comment.create_at,
          update_at: _comment.update_at
        });
      });
    });

  });

}

/**
 * Index
 */

exports.index = function (req, res, next) {

  if (!!req.params.resourceId) {
    var resourceId = req.params.resourceId
      , resourceId = sanitize(resourceId).xss();

    Comment.getCommentsByResourceId(resourceId, function (err, comments) {
      if (!!err) { return next(new Error(403)); }
      res.send(comments);
    });
  }
  else {
    Comment.list({}, function(err, data) {
      res.send(data);
    });
  }

};

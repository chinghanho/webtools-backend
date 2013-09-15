
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
  , sanitize = require('validator').sanitize
  , async = require('async');

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
      res.send(403);
      return next(new Error(err));
    }

    User.findByUserId(user, function(err, user) {

      if(!!err) {
        res.send(403);
        return next(new Error(err));
      }

      if(!!user) {

        async.series([
          user.increase_comments_count(function (err) {
            if (!!err) { return next(new Error(err)); }
          }),
          Resource.getResourceById(resource, function(err, resource) {
            resource.comments_count += 1;
            resource.save();
          }),
          res.json({
            body: _comment.body,
            user: {
              login: user.login,
              role: user.role
            },
            resource: _comment.resource,
            id: _comment.id,
            create_at: _comment.create_at,
            update_at: _comment.update_at
          })
        ]);

      }

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

    Comment.list({ resource: resourceId }, function (err, comments) {
      res.send(comments);
    });
  }
  else {
    Comment.list({}, function (err, data) {
      res.send(data);
    });
  }

};

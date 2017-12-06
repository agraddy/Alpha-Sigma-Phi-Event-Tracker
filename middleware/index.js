var Event = require("../models/event");
var Comment = require("../models/comment");

var middlewareObject = {};

middlewareObject.checkEventOwnership = function(req, res, next) {
    // Check if user is logged in. Then check if
    // owner is the author of the post.
    if (req.isAuthenticated()) {
        Event.findById(req.params.id, function(err, foundEvent) {
            if (err) {
                res.redirect("back");
                
            } else if (foundEvent.author.id.equals(req.user._id)) {
                next();

            } else {
                res.redirect("back");
            }
        });
    
    } else {
        res.redirect("back");
    }
};

middlewareObject.checkCommOwnership = function(req, res, next) {
    // Check if user is logged in. Then check if
    // owner is the author of the post.
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
                
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();

            } else {
                res.redirect("back");
            }
        });
    
    } else {
        res.redirect("back");
    }
};

middlewareObject.loggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();    
    }
    res.redirect("/login");
}


module.exports = middlewareObject;
var Event = require("../models/event");
var Comment = require("../models/comment");

var middlewareObject = {};


middlewareObject.loggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();    
    }
    req.flash("failure", "You must login to access this feature.");
    res.redirect("/login");
}


middlewareObject.checkEventOwnership = function(req, res, next) {
    // Check if user is logged in. Then check if
    // owner is the author of the post.
    if (req.isAuthenticated()) {
        Event.findById(req.params.id, function(err, foundEvent) {
            if (err) {
                req.flash("failure", "You don't have an event here.");
                res.redirect("back");
                
            } else if (foundEvent.author.id.equals(req.user._id)) {
                next();

            } else {
                req.flash("failure", "Access Denied.");
                res.redirect("back");
            }
        });
    
    } else {
        req.flash("failure", "Please login to do that.");
        res.redirect("back");
    }
};

middlewareObject.checkCommOwnership = function(req, res, next) {
    // Check if user is logged in. Then check if
    // owner is the author of the post.
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("failure", "That comment wasn't found!");
                res.redirect("back");
                
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();

            } else {
                req.flash("failure", "Access Denied.");
                res.redirect("back");
            }
        });
    
    } else {
        req.flash("failure", "Please login to do that.");
        res.redirect("back");
    }
};


module.exports = middlewareObject;
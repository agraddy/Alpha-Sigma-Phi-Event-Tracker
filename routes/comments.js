var express = require("express");
var router = express.Router({mergeParams: true});
var Event  = require("../models/event");
var Comment  = require("../models/comment");
var middleware = require("../middleware");


// COMMENTS //
router.get("/new", middleware.loggedIn, function(req, res) {
    // find the event through id
    Event.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {event: event});    
        }
    });
});


router.post("/", middleware.loggedIn, function(req, res) {
    // find event by id
    Event.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
            res.redirect("/events");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // username and id added to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    event.comments.push(comment);
                    event.save();
                    res.redirect("/events/" + event._id);
                }
            });
        }
    });
});


// EDIT
router.get("/:comment_id/edit", middleware.checkCommOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {event_id: req.params.id, comment: foundComment});    
        }
    });
});


// UPDATE
router.put("/:comment_id", middleware.checkCommOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id)
        }
    });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommOwnership, function(req, res) {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    });
});


module.exports = router;
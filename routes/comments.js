var express = require("express");
var router = express.Router({mergeParams: true});
var Event  = require("../models/event");
var Comment  = require("../models/comment");


// COMMENTS //
router.get("/new", loggedIn, function(req, res) {
    // find the event through id
    Event.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {event: event});    
        }
    });
});


router.post("/", loggedIn, function(req, res) {
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

function loggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();    
    }
    res.redirect("/login");
}

module.exports = router;
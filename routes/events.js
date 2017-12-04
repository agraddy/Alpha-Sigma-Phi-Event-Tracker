var express = require("express");
var router = express.Router();
var Event  = require("../models/event");

router.get("/", function(req, res) {
    // console.log(req.user);
    // Get all the events
    Event.find({}, function(err, allEvents){
        if(err) {
            console.log(err);
        } else {
            res.render("events/events", {events: allEvents, currentUser: req.user});
        }
    });
});


router.post("/", loggedIn, function(req, res) {
    // get data from form and add to events array.
    var name = req.body.name;
    var type = req.body.type;
    var datetime = req.body.datetime;
    var place = req.body.place;
    var image = req.body.image;
    var desc = req.body.desc;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    // Object blueprint
    var newEvent = {name: name, datetime: datetime, place: place, image: image, type: type, desc: desc, author: author};
    
    // CREATE new event
    Event.create(newEvent, function(err, newlyCreated) {
         if(err) {
             console.log(err);
         } else {
             res.redirect("/events");
         }
    });
});

router.get("/new", loggedIn, function(req, res) {
    res.render("events/new");
});

// SHOW
router.get("/:id", function(req, res) {
    // Find the event with the specific ID.
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundEvent);
            // That show template will be rendered for the event.
            res.render("events/show", {event: foundEvent});
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
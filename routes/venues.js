var express = require("express");
var router = express.Router({mergeParams: true});
var Venue  = require("../models/venue");
var middleware = require("../middleware");


// VENUES //
router.get("/new", middleware.loggedIn, function(req, res) {
    res.render("venues/new");
});



router.post("/", middleware.loggedIn, function(req, res) {
    // get data from form and add to events array.
    var name = req.body.name;
    
    // Object blueprint
    var newVenue = {name: name};
    
    // CREATE new venue
    Venue.create(newVenue, function(err, newlyCreated) {
         if(err) {
             console.log(err);
         } else {
             req.flash("success", "Venue added!");
             res.redirect("/events");
         }
    });
});



module.exports = router;

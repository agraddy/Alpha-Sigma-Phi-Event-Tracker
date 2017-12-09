var express = require("express");
var router = express.Router();
var Event  = require("../models/event");
var Venue  = require("../models/venue");
var middleware = require("../middleware");


router.get("/", function(req, res) {
    // Get all the events
    // Sort by datetime descending
    // To sort by datetime ascending remove the minus sign below
    Event.find().sort('-datetime').exec(function(err, allEvents){
	    console.log(allEvents);
	// Loop through and format date
	// There are other options besides manually formatting the date.
	// I used manual looping because it should work universally and is easy to understand
	// * You could use https://momentjs.com/
	// * If you are using Mongo 3.2 you can use an aggregate:
	//   https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/
	var dt;
	var time;
	var date;
	for(var i = 0; i < allEvents.length; i++) {
	    dt = new Date(allEvents[i].datetime);
	    // Format using Date methods:
	    // https://stackoverflow.com/a/36822046
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	    time = dt.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
	    date = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
	    allEvents[i].datetime = time + ' ' + date;
	}
        if(err) {
            console.log(err);
        } else {
            res.render("events/events", {events: allEvents, currentUser: req.user});
        }
    });
});


router.post("/", middleware.loggedIn, function(req, res) {
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

    var venues = [];
    var temp;
    for(var i = 0; i < req.body.venues.length; i++) {
	    temp = req.body.venues[i].split(';');
	    venues.push({id: temp[0], name: temp[1]});
    }
    
    // Object blueprint
    var newEvent = {name: name, datetime: datetime, place: place, image: image, type: type, desc: desc, author: author, venues};
    
    // CREATE new event
    Event.create(newEvent, function(err, newlyCreated) {
	    var index = 0;
         if(err) {
             console.log(err);
         } else {
		 // Just creating an async loop that will loop until all of the array has been processed
		function asyncLoop(i, venues) {
			var next;
			var temp;
			if(venues && i < venues.length) {
				console.log('i');
				console.log(i);
				console.log('venues');
				console.log(venues);
				temp = venues[i].split(';');
				i++;

				// Add the event id to the venue.events
				Venue.update({_id: temp[0]}, {$push: {events: {id: newlyCreated.id}}}, function(err, result) {
					if(err) {
						finish(err);
					} else {
						asyncLoop(i, venues);
					}
				});
			} else {
				finish();
			}
		}
		function finish(err) {
			if(err) {
				console.log(err);
			} else {
				req.flash("success", "Event added!");
				res.redirect("/events");
			}
		}
		asyncLoop(index, req.body.venues);
         }
    });
});

router.get("/new", middleware.loggedIn, function(req, res) {
    Venue.find(function(err, venues) {
        if(err) {
            console.log(err);
        } else {
            res.render("events/new", {venues: venues});    
        }
    });
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


// EDIT
router.get("/:id/edit", middleware.checkEventOwnership, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        res.render("events/edit", {event: foundEvent});
    });
});


// UPDATE
router.put("/:id", middleware.checkEventOwnership, function(req, res) {
    // find and update correct event
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent) {
        if(err) {
            res.redirect("/events");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    });
});


// DELETE
router.delete("/:id", middleware.checkEventOwnership, function(req, res) {
    Event.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/events");
        } else {
            req.flash("success", "Event deleted.");
            res.redirect("/events");
        }
    });
});


module.exports = router;

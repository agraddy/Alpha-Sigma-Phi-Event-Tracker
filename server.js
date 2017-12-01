var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Event          = require("./models/event"),
    populateDB     = require("./populate"),
    Comment        = require("./models/comment"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    // User           = require("./models/user"),
    methodOverride = require("method-override");
    

mongoose.connect("mongodb://localhost/asp_events");
    
// File system
var fs = require("fs");

app.use(bodyParser.urlencoded({extended: true}));

// The purpose of this middleware is to log our server activity for debugging
// purposes. All activity will be stored in server.log

// This has to be at the very top above all the routes because it must be running
// before we run routes. If we call this block of code after a defined route, it
// won't run.
app.use(function(req, res, next) {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`; // Gives time stamp, the type of request, and url

    console.log(log);
    fs.appendFile("server.log", log + "\n", function(error) {
        if (error) {
          console.log("Unable to append to server.log");
        }
    });
    next();
});

// Tells Express that we have assets in the /public folder.
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/bower_components"));

// default view engine so we don't need to constantly type ".ejs"
app.set("view engine", "ejs");
// app.use(methodOverride("_method"));
populateDB();


app.get("/", function(req, res) {
    res.render("home");
});





app.get("/events", function(req, res) {
    // Get all the events
    Event.find({}, function(err, allEvents){
        if(err) {
            console.log(err);
        } else {
            res.render("events/events", {events: allEvents});
        }
    });
});


app.post("/events", function(req, res) {
    // get data from form and add to events array.
    var name = req.body.name;
    var type = req.body.type;
    var datetime = req.body.datetime;
    var place = req.body.place;
    var image = req.body.image;
    var desc = req.body.desc;
    
    // Object blueprint
    var newEvent = {name: name, datetime: datetime, place: place, image: image, type: type, desc: desc};
    
    // CREATE new event
    Event.create(newEvent, function(err, newlyCreated) {
         if(err) {
             console.log(err);
         } else {
             res.redirect("/events");
         }
    });
});

app.get("/events/new", function(req, res) {
    res.render("events/new");
});

// SHOW
app.get("/events/:id", function(req, res) {
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





// COMMENTS //
app.get("/events/:id/comments/new", function(req, res) {
    // find the event through id
    Event.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {event: event});    
        }
    });
});


app.post("/events/:id/comments", function(req, res) {
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
                    event.comments.push(comment);
                    event.save();
                    res.redirect("/events/" + event._id);
                }
            });
        }
    });
});

// With this, our app won't crash when trying to access a route/link that doesn't
// exist. We will serve up a template.
// This must always be the last route otherwise it will always load before other
// routes.
// app.get("/*", function(req, res) {
//   res.render("unknown");
// });

function loggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();    
    }
    res.redirect("/login");
}



var port = process.env.PORT || 3000;
var ip = process.env.IP;

app.listen(port, ip, function() {
    console.log("Server is up on port " + port + " and on ip " + ip);
});

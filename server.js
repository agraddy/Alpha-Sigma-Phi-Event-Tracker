var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Event          = require("./models/event"),
    populateDB     = require("./populate"),
    Comment        = require("./models/comment"),
    Venue          = require("./models/venue"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    
    authRoutes     = require("./routes/auth"),
    commentRoutes  = require("./routes/comments"),
    eventRoutes    = require("./routes/events");
    venueRoutes    = require("./routes/venues");
    
// console.log(process.env.DBURL);
var db = process.env.DBURL || "mongodb://localhost/asp_events"
mongoose.connect(db);

// File system
var fs = require("fs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

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
app.use(methodOverride("_method"));
// populateDB();


app.use(require("express-session")({
    secret: "Gandiva",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
});


app.use("/", authRoutes);
app.use("/events/:id/comments/", commentRoutes);
app.use("/events", eventRoutes);

app.use("/venues", venueRoutes);


app.get("/", function(req, res) {
    res.render("home");
});




// With this, our app won't crash when trying to access a route/link that doesn't
// exist. We will serve up a template.
// This must always be the last route otherwise it will always load before other
// routes.
// app.get("/*", function(req, res) {
//   res.render("unknown");
// });


var port = process.env.PORT || 3000;
var ip = process.env.IP;

app.listen(port, ip, function() {
    console.log("Server is up on port " + port + " and on ip " + ip);
});

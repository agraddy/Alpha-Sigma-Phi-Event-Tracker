var mongoose = require("mongoose");

var venueSchema = mongoose.Schema({
    name: String,
    events: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    }]
});

module.exports = mongoose.model("Venue", venueSchema);

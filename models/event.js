var mongoose = require("mongoose");

// db.events.drop()
// Schema setup for events
var eventSchema = new mongoose.Schema({
    name: String,
    datetime: String,
    place: String,
    image: String,
    type: String,
    desc: String,
    // author: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //         },
    //         username: String
    // },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

// Model
module.exports = mongoose.model("Event", eventSchema);
var mongoose = require("mongoose");
var Event    = require("./models/event");
var Comment  = require("./models/comment");

var data = [
        {
            name: "Sigma Chi Halloween",
            datetime: "1:00 PM 11/11/2017", 
            place: "Fresno State", 
            image: "https://pbs.twimg.com/profile_images/378800000727758502/aaa68edb2494279347f4df8275ca90e6.jpeg", 
            type: "N/A",
            desc: "Bacon ipsum dolor amet turducken burgdoggen beef strip steak tongue. Picanha rump jowl ribeye pig. Hamburger spare ribs corned beef filet mignon sausage alcatra turkey bacon short ribs beef. Ham landjaeger fatback andouille pork belly pancetta short ribs ground round. Drumstick tail frankfurter venison alcatra prosciutto ball tip."
        },
        
        {
            name: "Alpha Sigma Phi Disney",
            datetime: "1:00 PM 10/03/2017", 
            place: "Across Fresno State", 
            image: "http://www.njit.edu/greeklife/sites/greeklife/files/styles/medium/public/badge.jpg", 
            type: "N/A",
            desc: "Sausage doner cow, shoulder beef ribs venison fatback pancetta andouille meatloaf. Landjaeger sausage venison pork. Pork chop porchetta flank, short ribs chicken pancetta burgdoggen venison boudin ribeye. Picanha tail spare ribs ball tip landjaeger sirloin tongue jowl strip steak."
        },
        
        {
            name: "Delta Zeta Pancakes",
            datetime: "1:00 PM 11/11/2017", 
            place: "DZ House", 
            image: "https://pbs.twimg.com/profile_images/629539667826884608/0lY3aEn5.jpg", 
            type: "Stone",
            desc: "DZ is hosting an event."
        },
        
        {
            name: "Alpha Sigma Phi Brose",
            datetime: "1:00 PM 11/11/2017", 
            place: "Fresno State", 
            image: "http://student.plattsburgh.edu/aprof001/Mobile/logo1.jpg", 
            type: "N/A",
            desc: "ASP is hosting an event."
        }
    ];

function populateDB(){
   //Remove all events.
   Event.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("REMOVED EVENTS!");
         //add a few events.
        data.forEach(function(seed){
            Event.create(seed, function(err, event){
                if(err){
                    console.log(err);
                } else {
                    console.log("added an event");
                    //create a comment
                    Comment.create(
                        {
                            text: "Henlo, friend.",
                            author: "Cockatiel"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                event.comments.push(comment);
                                event.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = populateDB;
var mongoose = require("mongoose");
var Food = require("./models/food");
var Comment = require("./models/comment")

var data = [
    {
        name: "ciba",
        image: "https://i.postimg.cc/5t7ZK3CT/ciba.jpg",
        description: "Cheesecake is a sweet dessert consisting of one or more layers. The main, and thickest layer, consists of a mixture of soft, fresh cheese, eggs, and sugar. If there is a bottom layer, it often consists of a crust or base made from crushed cookies, graham crackers, pastry, or sometimes sponge cake."
    },
    {
        name: "cheesecake",
        image: "https://i.postimg.cc/FzvrkhRc/cheesecake.jpg",
        description: "Cheesecake is a sweet dessert consisting of one or more layers. The main, and thickest layer, consists of a mixture of soft, fresh cheese, eggs, and sugar. If there is a bottom layer, it often consists of a crust or base made from crushed cookies, graham crackers, pastry, or sometimes sponge cake."
    },
    {
        name: "taro",
        image: "https://i.postimg.cc/HnZcVFc3/taro.jpg",
        description: "Cheesecake is a sweet dessert consisting of one or more layers. The main, and thickest layer, consists of a mixture of soft, fresh cheese, eggs, and sugar. If there is a bottom layer, it often consists of a crust or base made from crushed cookies, graham crackers, pastry, or sometimes sponge cake."
    },
]

function seedDB(){
    //remove
    Food.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed foods");
        //add a few foods
        Comment.remove({}, function(err){
            if(err){
                console.log(err)
            }
            console.log("removed comments");
            data.forEach(function(seed){
                Food.create(seed, function(err, food){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a food")
                        //create a comment
                        Comment.create(
                            {
                                text: "This is very yummy",
                                author: "Jie"
                            }, function(err, comment){
                                if(err){
                                    console.log(err)
                                } else {
                                    food.comments.push(comment);
                                    food.save();
                                    console.log("created new comment");
                                }
                            }
                        )
                    }
                });
            })
        })
    });
}

module.exports = seedDB;

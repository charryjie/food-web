var express = require("express");
var router = express.Router();
var Food = require("../models/food");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/", function (req, res) {
    Food.find({}, function (err, allFoods) {
        if(err) {
            console.log(err);
        } else {
            res.render("food/index", {food: allFoods, currentUser: req.user});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var time = req.body.time;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newFood = {name: name, time: time, image: image, description: desc, author: author};
    Food.create(newFood, function(err, newlyCreated){
        if(err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            req.flash("success", "Successfully created food");
            res.redirect("/food")
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("food/new");
});

//SHOW - show more info about one food
router.get("/:id", function(req, res){
    Food.findById(req.params.id).populate("comments").exec(function(err, foundFood){
        if(err){
            console.log(err);
        } else{
            console.log(foundFood);
            res.render("food/show", {food: foundFood});
        }
    });
});

//edit food route
router.get("/:id/edit", middleware.checkFoodOwnership, function(req, res) {
    Food.findById(req.params.id, function(err, foundFood) {
        res.render("food/edit", {food: foundFood});
    })
});

//update food route
router.put("/:id", middleware.checkFoodOwnership, function(req, res){
    Food.findByIdAndUpdate(req.params.id, req.body.food, function(err, updatedFood) {
        if(err) {
            res.redirect("/food");
        } else {
            res.redirect("/food/" + req.params.id);
        }
    })
})

//destory food route
router.delete("/:id", middleware.checkFoodOwnership, function(req, res) {
    Food.findById(req.params.id, function(err, foundFood) {
        if(err) {
            res.redirect("/food" + req.params.id);
        } 
        else {
            foundFood.comments.forEach((comment) => {
                Comment.findByIdAndRemove(comment, function(err) {
                    if(err) {
                        res.redirect("/food" + req.params.id);
                    }
                })
            })
        }
    })
    Food.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/food");
        } else {
            res.redirect("/food");
        }
    });
});

module.exports = router;
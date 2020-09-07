var express = require("express");
var router = express.Router({mergeParams: true});
var Food = require("../models/food");
var Comment = require("../models/comment")
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Food.findById(req.params.id, function(err, food){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {food: food});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Food.findById(req.params.id, function(err, food){
        if(err){
            console.log(err);
            res.redirect("/food");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    let date_ob = new Date();
                    let date = date_ob.getDate();
                    let month = date_ob.getMonth() + 1;
                    let year = date_ob.getFullYear();
                    comment.time = month + "/" + date + "/" + year;
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    food.comments.push(comment);
                    food.save();
                    req.flash("success", "Successfully created comment");
                    res.redirect("/food/" + food._id);
                }
            })
        }
    })
});

//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {food_id: req.params.id, comment: foundComment});
        }
    });
});


//update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/food/" + req.params.id);
        }
    });
});


//destory comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("sucess", "Comment deleted");
            res.redirect("/food/" + req.params.id);
        }
    });
});

module.exports = router;
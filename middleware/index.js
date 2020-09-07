var Food = require("../models/food");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkFoodOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Food.findById(req.params.id, function(err, foundFood) {
            if(err || !foundFood) {
                console.log(err)
                req.flash("error", "Food not found");
                res.redirect("back");
            } else {
                if(foundFood.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }    
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;
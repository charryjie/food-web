var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Food = require("./models/food"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

var foodRoutes = require("./routes/food"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb+srv://frontend:PKlgV9yVb75SJk9D@cluster0.pwsds.mongodb.net/<food_db>?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "I want to eat yummy food!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/food", foodRoutes);
app.use("/food/:id/comments", commentRoutes);
app.use(indexRoutes);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.listen(process.env.PORT);
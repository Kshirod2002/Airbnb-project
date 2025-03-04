const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// GET Signup Route: Renders the signup form.
router.get("/signup", (req,res) =>{
    res.render("users/signup.ejs");
});
// POST Signup Route: Handles user registration.
router.post("/signup", wrapAsync(async (req, res) =>{
    try{
            let {username,email, password} = req.body;
            const newUser = new User({email, username});
           const registeredUser= await User.register(newUser, password);
           console.log(registeredUser);
           // Log the user in automatically after successful registration.
           req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
           res.redirect("/listings");
         });
        }catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
);

// GET Login Route: Renders the login form.
router.get("/login", (req, res) =>{
    res.render("users/login.ejs");// Render the login view.
});
// POST Login Route: Authenticates the user and redirects them.
router.post( "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash: true,
}), 
   //userController.login
   async(req,res) =>{
    req.flash("success","Welcome back Woderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 }
);

// GET Logout Route: Logs the user out and redirects to the listings page.
router.get("/logout", (req,res,next) =>{
    req.logout((err) =>{
       if (err) {
        return next(err);
       }
       req.flash("success","You are logged out!");
       res.redirect("/listings");
    });
});
// Export the router for use in the application.
module.exports= router;
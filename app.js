// Load environment variables from .env file in non-production environments
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore= require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Import route handlers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Database connection URL
const dbUrl = process.env.ATLASDB_URL;
// Connect to MongoDB database
main()
  .then(() => { 
    console.log("Connected to DB");
})
  .catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}
// Set up view engine and directory for views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Middleware for parsing request bodies
app.use(express.urlencoded({extended: true}));
// Middleware for overriding HTTP methods (e.g., PUT, DELETE)
app.use(methodOverride('_method'));

// Set up EJS Mate as the template engine
app.engine("ejs",ejsMate);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname,"/public")));

// Configure session store with MongoDB
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
// Log errors related to the session store
store.on("error", () =>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

// Session options configuration
const sessionOptions ={
    store, // Use MongoDB to store session data
    secret: process.env.SECRET, // Encryption key
    resave: false, // Prevent session resaving if no changes
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Session expiration date
        maxAge: 7 * 24 * 60 * 60 * 1000, // Maximum session age
        httpOnly: true, // Make cookies accessible only by the server
    },
};

// Use session middleware with the configured options
app.use(session(sessionOptions));
// Middleware for flash messages (temporary session-based messages)
app.use(flash());

// Passport.js initialization and session handling
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for user authentication
passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// Middleware to set up local variables for templates
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    res.locals.mapToken = process.env.MAP_TOKEN;
    next();
});

// Mount routers
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// Catch-all route for undefined paths
app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Page not Found!"));
});
// General error-handling middleware
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});
  
// Start the server on port 8080
app.listen(8080, () => {
    console.log("Server is listening to port number 8080");
});
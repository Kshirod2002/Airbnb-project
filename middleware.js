const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema, reviewSchema } = require("./schema.js");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};
// Middleware to save the URL the user was trying to access before login
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
     let listing = await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`); 
    }
    next();
};
// Middleware to validate the listing data using a schema
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};
// Middleware to validate the review data using a schema
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};
// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id,reviewId } = req.params;
     let review = await Review .findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`); 
    }
    next();
};
const express = require("express");
const router = express.Router({mergeParams: true}); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Reviews
//PoST Review route: Handles creating a new review for a specific listing.
router.post("/",isLoggedIn, validateReview,
   wrapAsync(async (req, res) => {
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);// Create a new review instance using the request data.
    newReview.author = req.user._id;// Set the logged-in user as the author of the review.
    console.log(newReview);
    listing.reviews.push(newReview);// Add the review to the listing's reviews array.

    await newReview.save(); // Save the review to the database.
    await listing.save(); // Save the updated listing to the database.
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);    
})
);
//Delete  Review route: Handles deleting a specific review for a listing.
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor, 
   wrapAsync(async (req, res) =>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});// Remove the review ID from the listing's reviews array.
    await Review.findByIdAndDelete(reviewId);// Delete the review from the database.
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
 );
 // Export the router for use in the application.
module.exports = router;
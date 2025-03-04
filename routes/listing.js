const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");// Utility function to handle async errors
const Listing = require("../models/listing.js");// Listing model for database interactions
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');// Mapbox SDK for geocoding
const mapToken = process.env.MAP_TOKEN;// Environment variable for Mapbox token
const geocodingClient = mbxGeocoding({ accessToken: mapToken });// Initializing Mapbox geocoding client

// Middleware imports
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");// For handling file uploads
const { storage } = require("../cloudConfig.js");// Cloud storage configuration
const upload = multer({ storage });// Multer setup with cloud storage

// Index Route:Fetch and display all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from the database
    res.render("listings/index.ejs", { allListings });// Render the index page with listings
}));

// New Route: Render the form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route: Handle form submission to add a new listing
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(async (req, res) => {
        const { listing } = req.body;
          // Geocode the listing's location
       let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit : 1,
       })
       .send();
     // Set default geometry if not provided
        if (!listing.geometry) {
            listing.geometry = {
                type: "Point",
                coordinates: [0, 0], // Default coordinates
            };
        }

        //const newListing = new Listing(listing);
        const newListing = new Listing(req.body.listing); // Create a new Listing instance
        newListing.owner = req.user._id;// Associate listing with the logged-in user
         // Add image data if provided
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        };
        newListing.geometry = response.body.features[0].geometry;// Add geolocation data

        let savedListing = await newListing.save();// Save the listing to the database
        console.log(savedListing);
        
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);

// Show Route: Display details of a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },// Populate review authors
        })
        .populate("owner"); // Populate the listing owner

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
         res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));

// Edit Route: Render the form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
// Optimize image URL for thumbnail display
    let originalImageUrl = listing.image.url;
    if (originalImageUrl.includes("/upload")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}));

// Update Route: Handle form submission to update a listing
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      // Update image if a new file is uploaded
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
            await listing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    })
);

// Delete Route: Remove a listing from the database
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (deletedListing) {
        req.flash("success", "Listing Deleted!");
    }

    res.redirect("/listings");
}));

module.exports = router;

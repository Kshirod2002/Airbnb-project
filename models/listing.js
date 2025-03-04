const mongoose = require("mongoose"); // Import mongoose for database interaction
const Schema = mongoose.Schema; // Create a reference to the Schema constructor
const Review = require("./review.js"); // Import the Review model for handling associated reviews

// Define the schema for a listing
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: {
            type: String,
            required: true, // Ensure URL is provided
        },
        filename: {
            type: String,
            required: true, // Ensure filename is provided
        },
    },
    price: {
        type: Number,
        required: true, // Ensure price is always provided
    },
    location: {
        type: String,
        required: true, // Ensure location is provided
    },
    country: {
        type: String,
        required: true, // Ensure country is provided
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, // Owner must always be specified
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // Only "Point" is allowed
            required: true,
        },
        coordinates: {
            type: [Number], // Coordinates are represented as an array of numbers [longitude, latitude]
            required: true, // Coordinates are required
            default: [0, 0], // Default coordinates set to (0, 0)
        },
    },
});

// Middleware to handle cleanup of associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        try {
            // Delete all reviews associated with the deleted listing
            await Review.deleteMany({ _id: { $in: listing.reviews } });
        } catch (error) {
            console.error("Error deleting associated reviews:", error);
        }
    }
});

// Create the Listing model from the schema
const Listing = mongoose.model("Listing", listingSchema);

// Export the Listing model for use in other parts of the application
module.exports = Listing;
const mongoose = require("mongoose"); // Import mongoose for MongoDB interaction
const Schema = mongoose.Schema; // Create a reference to the Schema constructor

// Define the schema for a review
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,  // Use 'Number' (uppercase 'N')
        min: 1,
        max: 5
    },
    createdAt: {  // Use 'createdAt' to follow the standard naming convention
        type: Date,  // Use 'Date' (uppercase 'D')
        default: Date.now(),  // Remove parentheses
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

// Export the Review model for use in other parts of the application
module.exports = mongoose.model("Review", reviewSchema);
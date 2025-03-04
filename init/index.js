// Import necessary modules
const mongoose = require("mongoose"); // Mongoose is used for interacting with MongoDB
const Listing = require("../models/listing.js"); // Import the Listing model

// Get the database connection URL from environment variables
const dbUrl = process.env.ATLASDB_URL;
// Connect to the MongoDB database
main()
  .then(() => {
    console.log("Connected to DB");
})
  .catch((err) => {
    console.log(err);
});

// Define the main function to establish the database connection
async function main() {
    await mongoose.connect(dbUrl);
}
 
// Initialize the database with default data
const initDB = async () => {
    try {
        // Remove all existing documents in the Listing collection
        await Listing.deleteMany({});
         // Ensure the initdata.data is an array before proceeding
        if (Array.isArray(initdata.data)) {
            // Map through the data array to add or modify properties for each object
            initdata.data = initdata.data.map((obj) => ({
                ...obj,
                owner: '67738e60e28660f46ef81372',
                geometry: {
                    type: obj.geometry?.type || 'Point', // Default to 'Point' if missing
                    coordinates: obj.geometry?.coordinates || [0, 0], // Default coordinates
                },
            }));
            // Insert the modified data into the Listing collection
            await Listing.insertMany(initdata.data);
            console.log("Data was initialized");
        } else {
            throw new Error("Invalid data format: initdata.data must be an array.");
        }
    } catch (error) {
        console.error("Error in initDB:", error);
    }
};
// Call the initDB function to initialize the database
initDB();

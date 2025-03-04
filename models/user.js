const mongoose = require("mongoose"); // Import mongoose for MongoDB interaction
const Schema = mongoose.Schema; // Create a reference to the Schema constructor
const passportLocalMongoose = require("passport-local-mongoose"); // Import passport-local-mongoose plugin for authentication

// Define the schema for a user
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);

// Export the User model for use in other parts of the application
module.exports = mongoose.model('User',userSchema);
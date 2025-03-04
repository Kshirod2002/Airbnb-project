// Custom Error Class: ExpressError
class ExpressError extends Error {
    constructor(statusCode , message){
        super(); // Call the parent Error class constructor.
        this.statusCode= statusCode;// Assign the HTTP status code.
        this.message = message;// Assign the error message.
    }
}
// Export the custom error class for use in other parts of the application.
module.exports = ExpressError;
// Import the Joi validation library
const joi = require('joi');

// Schema for validating the listing data
module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image : joi.string().allow("",null),
    }).required()
});
// Schema for validating review data
module.exports.reviewSchema = joi.object({
    review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment:joi.string().required(),
    }).required(),
});
// Middleware to validate review data using the review schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };
const { listingSchema, reviewSchema } = require('./schemas');
const AppError = require('./errors/AppError');

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new AppError(msg, 400);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new AppError(msg, 400);
  }
  next();
};

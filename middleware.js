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

// module.exports.isLoggedIn = (req, res, next) => {
//    if(!req.isAuthenticated()){
//     //redirect url
//     req.session.redirectUrl = req.originalUrl;
//         req.flash("error", "You must be logged in to create a listing");
//         return res.redirect("/login");
//     } 
//   next();
// };


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {

    // ✅ Only save redirect for GET requests
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    } else {
      // ✅ For POST (reviews, delete, etc.)
      req.session.redirectUrl = req.get("Referer");
    }

    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const Listing = require('./models/listing');
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check if logged in
  if (!req.user) {
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }

  // Check ownership
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id: listingId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${listingId}`);
  }
  if (!review.author.equals(req.user._id)) {
     req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${listingId}`);
  }
  next();
};
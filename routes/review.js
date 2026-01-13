const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schemas");
const AppError = require("../errors/AppError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateListing, validateReview } = require("../middleware");
const mongoose = require("mongoose");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

/// Add review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
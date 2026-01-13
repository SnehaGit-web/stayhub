const Listing = require("../models/listing");
const Review = require("../models/review");
const mongoose = require("mongoose");
const AppError = require("../errors/AppError");

module.exports.createReview = async (req, res) => {
    const { id: listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError("Listing not found", 404);

    const review = new Review(req.body.review);
    review.author = req.user._id;

    await review.save();
    listing.reviews.push(review);
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${listingId}`);
  }

  module.exports.destroyReview = async (req, res) => {
    const { id: listingId, reviewId } = req.params;

    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${listingId}`);
  }
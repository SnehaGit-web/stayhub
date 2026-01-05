const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schemas");
const AppError = require("../errors/AppError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateListing, validateReview } = require("../middleware");
const mongoose = require("mongoose");

//Reviews routes would go here
router.post(
  "/", validateReview,
  wrapAsync(async (req, res) => {
    
    const { id: listingId } = req.params;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new AppError("Listing not found", 404);
    }

    const review = new Review(req.body.review);
    await review.save();

    listing.reviews.push(review);
    await listing.save();

    res.redirect(`/listings/${listingId}`);
  })
);


//Delete Review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
     //console.log("REQ.PARAMS:", req.params);   
    //console.log("REQ.BODY:", req.body);
    const { id: listingId, reviewId } = req.params;
   //     console.log("listingId:", listingId);
    //console.log("reviewId:", reviewId);
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${listingId}`);
  })
);
module.exports = router;
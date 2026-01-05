const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schemas");
const AppError = require("../errors/AppError");
const Listing = require("../models/listing");
const { validateListing, validateReview } = require("../middleware");
const mongoose = require("mongoose");

// Index
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// Show
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Listing ID", 400);
  }

  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    throw new AppError("Listing not found", 404);
    req.flash("error", "Listing not found");    
    res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}));

// Create
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    if (!newListing) {
        req.flash("error", "Failed to create listing");
      throw new AppError("Failed to create listing", 500);
    } else {
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    }
  })
);

// Edit
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
   if (!listing) {
    throw new AppError("Listing not found", 404);
    req.flash("error", "Listing not found");    
    res.redirect("/listings");
  }
  req.flash("success", "Editing listing");
  res.render("listings/edit", { listing });
}));

// Update
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    if (!listing) throw new AppError("Listing not found", 404);
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${req.params.id}`);
  })
);

// Delete
router.delete("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
   if (!listing) {
      req.flash("error", "Listing not found");
      throw new AppError("Listing not found", 404);
    }
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
}));

module.exports = router;
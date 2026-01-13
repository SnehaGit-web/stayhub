const Listing = require("../models/listing");
const mongoose = require("mongoose");
const AppError = require("../errors/AppError");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const baseClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Listing ID", 400);
  }

  // Populate owner only if exists
  const listing = await Listing.findById(id)
    .populate({
    path: "reviews",
    populate: { path: "author" } // populate review authors
  })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
  let response = await baseClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send()
    .then(async (geoData) => {
      req.body.listing.geometry = geoData.body.features[0].geometry;
    });
  let url = req.file.path;
  let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };
    newListing.geometry = req.body.listing.geometry;
    await newListing.save();
    if (!newListing) {
        req.flash("error", "Failed to create listing");
      throw new AppError("Failed to create listing", 500);
    } else {
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    }
  }

  module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let orginalImageURL = listing.image.url;
  orginalImageURL = orginalImageURL.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, orginalImageURL });
}

module.exports.updateListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
  }
  req.flash("success", "Successfully updated listing!");
  res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted listing!");
  res.redirect("/listings");
}
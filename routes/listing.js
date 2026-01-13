const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schemas");
const AppError = require("../errors/AppError");
const Listing = require("../models/listing");
const { validateListing, validateReview, isLoggedIn, isOwner } = require("../middleware");
const mongoose = require("mongoose");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage: storage });

// Index and Create
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// New
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, and Delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isOwner, wrapAsync(listingController.destroyListing));

// Edit
router.get("/:id/edit", isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
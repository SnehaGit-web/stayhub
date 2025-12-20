// ==============================
//         REQUIREMENTS
// ==============================
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync");
const AppError = require("./errors/AppError");
const { validateListing } = require("./middleware");

// Initialize app
const app = express();

// ==============================
//      MIDDLEWARE SETUP
// ==============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==============================
//       DATABASE CONNECTION
// ==============================
mongoose.connect("mongodb://localhost:27017/stayhub")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// ==============================
//           ROUTES
// ==============================

// Index
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Listing ID", 400);
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  res.render("listings/show", { listing });
}));

// Create
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404);
  res.render("listings/edit", { listing });
}));

// Update
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    if (!listing) throw new AppError("Listing not found", 404);
    res.redirect(`/listings/${req.params.id}`);
  })
);

// Delete
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
}));

// ==============================
//      ERROR HANDLING
// ==============================

// 404
app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

// Central Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// ==============================
//        START SERVER
// ==============================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

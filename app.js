// ==============================
//         REQUIREMENTS
// ==============================
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");


// Initialize app
const app = express();

// ==============================
//      MIDDLEWARE SETUP
// ==============================

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// For PUT / DELETE using forms
app.use(methodOverride("_method"));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// EJS View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//EJS Mate setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");


// ==============================
//       DATABASE CONNECTION
// ==============================
const MONGO_URL = "mongodb://localhost:27017/stayhub";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));


// ==============================
//           ROUTES
// ==============================

// Home Route
app.get("/", (req, res) => {
  res.send("Server running...");
});

// Index Route (listings)
app.get("/listings", async (req, res) => {
  //const Listing = require("./models/listing");
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

//New Listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

// Create Listing Route
app.post("/listings", async (req, res) => {
  if (!req.body.listing.image) {
    req.body.listing.image = {};
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// app.post("/listings", async (req, res) => {
    
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// });


// Edit Listing Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

// Update Listing Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  //res.redirect("/listings");
 res.redirect(`/listings/${id}`);
});

// Delete Listing Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// 404 PAGE
app.use((req, res) => {
  res.status(404).render("404");
});


// ==============================
//        START SERVER
// ==============================
app.listen(3000, () => {
  console.log("🚀 Server started on http://localhost:3000");
});

// ============================== 
//         REQUIREMENTS
// ==============================
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing");



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
app.get("/", async (req, res) => {
  res.send("Server running...");
  const allListings = await Listing.find({});
  console.log(allListings);
});




// ==============================
//        START SERVER
// ==============================
app.listen(3000, () => {
  console.log("🚀 Server started on http://localhost:3000");
});

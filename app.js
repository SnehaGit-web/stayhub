// ==============================
//         REQUIREMENTS
// ==============================
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

//const Listing = require("./models/listing");
//const wrapAsync = require("./utils/wrapAsync");
//const { listingSchema, reviewSchema } = require("./schemas");
const AppError = require("./errors/AppError");
const { validateListing, validateReview } = require("./middleware");
//const Review = require("./models/review");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

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

const sessionOptions = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
};
app.use(session(sessionOptions));
app.use(flash());
// Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

// ==============================
//      ERROR HANDLING
// ==============================

// 404
app.use((req, res, next) => {
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

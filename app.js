// ==============================
//         REQUIREMENTS
// ==============================
if(process.env.NODE_ENV !== "production"){
require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./errors/AppError");
const { validateListing, validateReview } = require("./middleware");
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

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

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + currentUser middleware (AFTER passport)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ==============================
//      ERROR HANDLING
// ==============================

// 404
// app.use((req, res, next) => {
//   next(new AppError("Page Not Found", 404));
// });


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

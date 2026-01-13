const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

// Signup routes
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// Login routes
router.route("/login")
.get((req, res) => { res.render("users/login");})
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

// Handle logout logic
router.get("/logout", userController.logout);

module.exports = router;
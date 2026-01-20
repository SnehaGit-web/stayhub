const User = require("../models/user");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// Signup logic
module.exports.signup = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });

      const registeredUser = await User.register(newUser, password);

    // Log the user in immediately after registration
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome to StayHub!");
      // Redirect safely only once
      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      res.redirect(redirectUrl);
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};

// Login logic
  module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to StayHub!");
  const redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl; // Clear saved URL
    res.redirect(redirectUrl);
};

// Logout logic
  module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};

# Copilot Instructions for StayHub

## Project Overview
- **StayHub** is a Node.js/Express web app for listing and reviewing stays, using MongoDB for data, EJS for views, and Bootstrap for styling.
- Key directories: 
  - `models/`: Mongoose schemas for `listing`, `review`, `user`.
  - `routes/`: Express routers for listings, reviews, users.
  - `views/`: EJS templates (with layouts/includes) for all pages.
  - `public/`: Static assets (CSS/JS).
  - `middleware.js`, `utils/`: Custom error handling, async wrappers.
  - `schemas.js`: Joi validation schemas.

## Architecture & Patterns
- **MVC-like structure**: Models (Mongoose), Views (EJS), Controllers (route handlers).
- **Error handling**: Uses custom `AppError` (see `errors/AppError.js` and `utils/AppError.js`), with centralized error middleware.
- **Async error handling**: Use `wrapAsync` from `utils/wrapAsync.js` for route handlers.
- **Validation**: Joi schemas in `schemas.js` for validating user input on listings/reviews.
- **Authentication**: User model and routes in `models/user.js` and `routes/user.js` (likely uses Passport.js, check for details).
- **Flash messages**: EJS includes for displaying flash messages (see `views/includes/flash.ejs`).

## Developer Workflows
- **Start server**: `node app.js` (or use `nodemon` if installed).
- **Seed/test data**: See `init/data.js` and `init/index.js` for database seeding scripts.
- **Testing**: No formal test framework detected; manual testing via browser or scripts in `test.js`.
- **Debugging**: Use console logs or Node.js debugging tools.

## Project Conventions
- **Route structure**: RESTful routes for listings and reviews. Nested routes for reviews under listings.
- **Error propagation**: Throw `AppError` for custom errors, pass to next middleware.
- **EJS partials**: Use `views/includes/` for navbar, footer, flash, etc. Layouts in `views/layouts/`.
- **Static files**: Served from `public/`.
- **Validation**: Always validate request bodies using Joi before DB operations.

## Integration Points
- **MongoDB**: Mongoose models in `models/`.
- **Session/Auth**: User model and session logic in `routes/user.js` and `models/user.js`.
- **External dependencies**: Express, Mongoose, Joi, EJS, Bootstrap, (likely Passport.js).

## Examples
- To add a new listing: create a Mongoose schema, add a route in `routes/listing.js`, and a view in `views/listings/`.
- To add validation: define a Joi schema in `schemas.js`, use in route handler with `wrapAsync`.
- To handle errors: throw `new AppError(message, statusCode)` and ensure error middleware is in use.

## Key Files
- `app.js`: Main entry, Express app setup.
- `routes/`: All route logic.
- `models/`: Data models.
- `schemas.js`: Joi validation.
- `middleware.js`: Custom middleware.
- `views/`: EJS templates.
- `public/`: Static assets.

---
For more details, see the README.md or explore the codebase. Update this file as project structure evolves.

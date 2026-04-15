
# StayHub

A full-stack vacation rental platform built with Node.js, Express, MongoDB, and EJS. Users can list properties, upload photos, leave reviews, and explore listings on an interactive map.

---

## Live Demo

🌐 **[https://stayhub-jkel.onrender.com](https://stayhub-jkel.onrender.com)**

> Note: Free tier on Render — first load may take 30 seconds to wake up.

---

## Features

**Guests**
- Browse all property listings
- View listing details with photos and location map
- Leave star ratings and written reviews
- Delete own reviews

**Hosts**
- Register and log in securely
- Create new property listings with photo uploads
- Edit and delete own listings
- Listings displayed on interactive Mapbox map

**Security**
- Session-based authentication with secure cookies
- Authorization — users can only edit/delete their own listings and reviews
- Input validation and sanitization on all forms
- Flash messages for user feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Templating | EJS + EJS-Mate layouts |
| Authentication | Passport.js + express-session |
| Image uploads | Cloudinary + Multer |
| Maps | Mapbox GL JS |
| Validation | Joi schema validation |
| Styling | Bootstrap 5 |

---

## Project Structure

```
stayhub/
├── controllers/        # Route handler logic
├── models/             # Mongoose schemas (User, Listing, Review)
├── routes/             # Express routers
├── views/              # EJS templates
│   ├── listings/       # Index, show, new, edit pages
│   ├── users/          # Login, register pages
│   └── layouts/        # Shared boilerplate
├── public/             # Static assets (CSS, JS)
├── utils/              # Error handling utilities
├── middleware.js        # Auth and validation middleware
├── schemas.js          # Joi validation schemas
├── cloudConfig.js      # Cloudinary configuration
└── app.js              # Express app entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier)
- Mapbox account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/SnehaGit-web/stayhub.git
cd stayhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAPBOX_TOKEN=your_mapbox_public_token
```

**Getting your credentials:**
- MongoDB Atlas — create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Cloudinary — sign up at [cloudinary.com](https://cloudinary.com) → Dashboard → copy Cloud name, API Key, API Secret
- Mapbox — sign up at [mapbox.com](https://mapbox.com) → Tokens → copy your default public token

### 4. Seed the database (optional)

```bash
node init/index.js
```

### 5. Start the server

```bash
node app.js
```

Open `http://localhost:8080`

---

## Key Technical Decisions

**Why EJS over React?**
StayHub is a server-rendered application — pages are generated on the server and sent as complete HTML. This is appropriate for a content-heavy listing site where SEO and initial load time matter. It also demonstrates understanding of both server-rendered and client-rendered (React) architectures.

**Why Cloudinary for images?**
Storing images directly in MongoDB is impractical for binary files. Cloudinary provides a CDN-backed image hosting service with automatic optimization, resizing, and format conversion. Images are uploaded via Multer (multipart form handling) then stored on Cloudinary — only the URL is saved in MongoDB.

**Why Joi for validation?**
Express does not validate incoming data by default. Joi schemas define the exact shape and constraints of valid listing and review data server-side — preventing malformed or malicious data from reaching the database even if client-side validation is bypassed.

**Why Passport.js?**
Passport provides a clean abstraction for authentication strategies. The local strategy handles username/password auth with bcrypt hashing. Sessions are stored server-side and identified by a signed cookie — more secure than JWT for a server-rendered app where the client never needs to read the token.

---

## Security Practices

- Passwords hashed with bcrypt via Passport.js
- Session secret stored in environment variables
- Authorization checks on all mutating routes — users cannot edit others' listings
- Joi validation on all form inputs server-side
- Mongoose schema validation as a second layer of data integrity
- Environment variables never committed to Git

---

## Author

Sneha — Full Stack Developer
GitHub: [SnehaGit-web](https://github.com/SnehaGit-web)

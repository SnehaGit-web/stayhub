if(process.env.NODE_ENV !== "production"){
require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = process.env.ATLASDB_URL;

main().then(() => console.log("✅ MongoDB connection successful"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
     const ownerId = new mongoose.Types.ObjectId("6955b39de914a38833351b87");
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: ownerId
  }));
    await Listing.insertMany(listingsWithOwner);
    console.log("Database initialized with sample data");
}

initDB();


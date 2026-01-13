// fixListingsOwner.js
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

const MONGO_URL = "mongodb://localhost:27017/stayhub";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB");

  // Find a default user to assign as owner
  const defaultUser = await User.findOne();
  if (!defaultUser) {
    console.log("❌ No users found in DB. Create a user first.");
    process.exit();
  }

  // Find listings with no owner
  const listingsWithoutOwner = await Listing.find({ owner: { $exists: false } });
  console.log(`Found ${listingsWithoutOwner.length} listings without owner.`);

  for (const listing of listingsWithoutOwner) {
    listing.owner = defaultUser._id;
    await listing.save();
    console.log(`✅ Assigned owner to listing: ${listing.title}`);
  }

  console.log("✅ Done fixing listings.");
  mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  mongoose.connection.close();
});

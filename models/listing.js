const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
         required: true
        },
    description: String,
    image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=604",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v
    }
  },
    price: Number,
    location: String,
    country: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    createdAt: { type: Date, default: Date.now }
});
listingSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await mongoose.model("Review").deleteMany({ _id: { $in: doc.reviews } });
    } 
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
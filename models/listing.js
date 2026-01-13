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
      url: String,
      filename: String
  },
    price: Number,
    location: String,
    country: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    createdAt: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
});
listingSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await mongoose.model("Review").deleteMany({ _id: { $in: doc.reviews } });
    } 
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
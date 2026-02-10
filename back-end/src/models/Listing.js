import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    brand: String,
    model: String,
    year: String,
    km: String,
    fuel: String,
    transmission: String,
    description: String,
    body: String,
    engine: String,
    owners: String,

    sellerType: {
      type: String,
      enum: ["individual", "dealer"],
      default: "individual",
    },


    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔑 OWNER
    },

    featured: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);

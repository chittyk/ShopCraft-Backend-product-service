const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // ✅ Thumbnail image (used for product cards/list)
    thumbnail: {
      url: {
        type: String,
        // required: true,
      },
      publicId: String,
      alt: {
        type: String,
        default: "Product thumbnail",
      },
    },

    // ✅ Additional gallery images
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
      },
    ],

    tags: [String],
    features: [String],
    brand: {
      type: String,
      default: "Generic",
    },

    isActive: { type: Boolean, default: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    off: {
      type: Number,
      default: 0, // 0% discount by default
      min: [0, "Discount cannot be less than 0%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    ratings: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
      6: { type: Number, default: 0 },
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    extraNote: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);

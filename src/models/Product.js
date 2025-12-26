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
      alt: {
        type: String,
        default: "Product thumbnail",
      },
    },

    // ✅ Additional gallery images
    images: [
      {
        url: String,
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
      ref: "Category", // optional: good for relationships
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      required: true,
      min: [0, "Old price cannot be negative"],
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
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

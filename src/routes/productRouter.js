const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductRating,
} = require("../controller/productController");

const adminAuth = require("../middleware/adminAuth");
const router = express.Router();
router.post("/", adminAuth, createProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);
router.patch("/:id/rating", updateProductRating);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;

const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductRating,
  uploadImg,
} = require("../controller/productController");
const upload = require("../middleware/upload")
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();
router.post("/", createProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);
router.patch("/:id/rating", updateProductRating);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);
// router.post("/uploadImage",adminAuth,uploadImg)

router.post("/upload-image", upload.single("image"), uploadImg);

module.exports = router;

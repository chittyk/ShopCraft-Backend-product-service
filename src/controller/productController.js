const Product = require("../models/Product");
const axios = require("axios");
const FormData = require("form-data");


// create product
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      stock,
      tags,
      features,
      brand,
      extraNote,
      category,
      off, 
      thumbnail,
      images,
      isActive,
      isPremium,
    } = req.body;

    // VALIDATION
    if (!productName || !description || price == null || stock == null || !category) {
      return res.status(400).json({ msg: "Some required fields are missing" });
    }

    if (price < 0) {
      return res.status(400).json({ msg: "Price cannot be negative" });
    }

    if (stock < 0) {
      return res.status(400).json({ msg: "Stock cannot be negative" });
    }

    if (off != null && (off < 0 || off > 100)) {
      return res.status(400).json({ msg: "Invalid discount percentage" });
    }

    const isExist = await Product.findOne({ productName });
    if (isExist) {
      return res.status(409).json({ msg: "Product already exists" });
    }

   //  CREATE PRODUCT
    const newProduct = new Product({
      productName,
      description,

      price,
      off: off || 0,

      stock,

      tags: tags || [],
      features: features || [],

      brand: brand || "Generic",
      extraNote,

      category,

      thumbnail: thumbnail || undefined,
      images: images || [],

      isActive: isActive !== undefined ? isActive : true,
      isPremium: isPremium || false,
    });

    //  SAVE DATA 
    await newProduct.save();

    return res.status(201).json({
      msg: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};



/* =========================
   GET PRODUCTS
========================= */
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (q) filter.$text = { $search: q };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let categoryData = "Uncategorized";

    try {
      const categoryServiceUrl =
        process.env.BASEURL + "category/" + product.category;
      const response = await axios.get(categoryServiceUrl);
      categoryData = response.data.name;
    } catch (error) {
      console.error("Category fetch error:", error.message);
    }

    res.status(200).json({
      ...product.toObject(),
      category: categoryData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.off < 0 || updates.off > 100) {
      return res.status(400).json({ msg: "Invalid discount percentage" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct)
      return res.status(404).json({ msg: "Product not found" });

    res.status(200).json({
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({ msg: "Product not found" });

    res.status(200).json({
      msg: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   UPDATE PRODUCT RATING
========================= */
const updateProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;

    if (!stars || stars < 1 || stars > 6)
      return res.status(400).json({ msg: "Invalid rating value" });

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { [`ratings.${stars}`]: 1 } },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ msg: "Product not found" });

    res.status(200).json({
      msg: `⭐ ${stars}-star rating added successfully`,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   IMAGE UPLOAD (MEDIA SERVICE)
========================= */
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

const uploadImg = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Image uploaded successfully (MOCKED)",
    imageUrl: "https://via.placeholder.com/150",
    publicId: "mock-id",
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductRating,
  uploadImg,
};




// const Product = require("../models/Product");
// const axios = require("axios");
// const FormData = require("form-data");


// // Create a new product
// const createProduct = async (req, res) => {
//   try {
//     const {
//       productName,
//       description,
//       price,
//       oldPrice,
//       stock,
//       tags,
//       features,
//       brand,
//       extraNote,
//       category,
//     } = req.body;

//     // 1️Validate required fields
//     if (
//       !productName ||
//       !description ||
//       !price ||
//       !oldPrice ||
//       !stock ||
//       !category
//     ) {
//       return res.status(400).json({ msg: "Some required fields are missing" });
//     }
//     const isExist = await Product.findOne({ productName });

//     if (isExist) return res.status(401).json({ msg: "product already exist" });

//     // 2️⃣ Create new product
//     const newProduct = new Product({
//       productName,
//       description,
//       price,
//       oldPrice,
//       stock,
//       tags: tags || [],
//       features: features || [],
//       brand,
//       extraNote,
//       category,
//     });

//     // 3️⃣ Save to DB
//     await newProduct.save();

//     // 4️⃣ Send response
//     res.status(201).json({
//       msg: "Product created successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// const getProducts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, brand, q } = req.query;
//     const filter = {};

//     if (category) filter.category = category;
//     if (brand) filter.brand = brand;
//     if (q) filter.$text = { $search: q }; // full-text search on indexed fields

//     const products = await Product.find(filter)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .sort({ createdAt: -1 });

//     const total = await Product.countDocuments(filter);

//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Find the product by id
//     console.log("id : ", id);
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     let categoryData = null;

//     // Fetch category from category service
//     try {
//       // const categoryServiceUrl = `http://localhost:8082/api/category/laptops-1760193729233`;
//       console.log(process.env.BASEURL + "category/" + product.category);
//       const categoryServiceUrl =
//         process.env.BASEURL + "category/" + product.category;

//       const response = await axios.get(categoryServiceUrl);
//       categoryData = response.data.name;

//       console.log("categorydata :", categoryData);
//     } catch (error) {
//       console.error("Category fetch error:", error.message);
//       categoryData = "Uncategorized";
//     }

//     // Merge product data with full category info
//     const result = {
//       ...product.toObject(), // cleaner than _doc
//       category: categoryData,
//     };

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     });
//     console.log(updatedProduct);

//     if (!updatedProduct) {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.status(200).json({
//       msg: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedProduct = await Product.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.status(200).json({
//       msg: "Product deleted successfully",
//       product: deletedProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// const updateProductRating = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stars } = req.body; // 1–6

//     if (!stars || stars < 1 || stars > 6)
//       return res.status(400).json({ msg: "Invalid rating value" });

//     const product = await Product.findByIdAndUpdate(
//       id,
//       { $inc: { [`ratings.${stars}`]: 1 } }, // increment proper star
//       { new: true },
//     );

//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     res.status(200).json({
//       msg: `⭐ ${stars}-star rating added successfully`,
//       product,
//     });
//   } catch (error) {
//     console.error("Error updating rating:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };




// const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;
// // example: http://localhost:8088

// const uploadImg = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No image file uploaded",
//       });
//     }

//     const image = req.file;

//     // 🔁 Create form-data for media service
//     const formData = new FormData();
//     formData.append("image", image.buffer, {
//       filename: image.originalname,
//       contentType: image.mimetype,
//     });

     
//     const mediaResponse = await axios.post(
//       `${MEDIA_SERVICE_URL}/api/media/upload`,
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//         },
//         maxBodyLength: Infinity,
//         timeout: 15000,
//       }
//     );

//     // ✅ Response from media service
//     const { url, publicId } = mediaResponse.data;

//     return res.status(201).json({
//       success: true,
//       message: "Image uploaded via media service",
//       imageUrl: url,
//       publicId,
//     });

//   } catch (error) {
//     console.error("Media Service Error:", error.response?.data || error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to upload image via media service",
//     });
//   }
// };



// module.exports = {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   updateProductRating,
//   uploadImg
// };

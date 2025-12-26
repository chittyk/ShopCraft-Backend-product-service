const Product = require("../models/Product");
const axios = require("axios");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      oldPrice,
      stock,
      tags,
      features,
      brand,
      extraNote,
      category,
    } = req.body;

    // 1️Validate required fields
    if (
      !productName ||
      !description ||
      !price ||
      !oldPrice ||
      !stock ||
      !category
    ) {
      return res.status(400).json({ msg: "Some required fields are missing" });
    }
    const isExist = await Product.findOne({ productName });

    if (isExist) return res.status(401).json({ msg: "product already exist" });

    // 2️⃣ Create new product
    const newProduct = new Product({
      productName,
      description,
      price,
      oldPrice,
      stock,
      tags: tags || [],
      features:features || [],
      brand,
      extraNote,
      category,
    });

    // 3️⃣ Save to DB
    await newProduct.save();

    // 4️⃣ Send response
    res.status(201).json({
      msg: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (q)
      filter.$text = { $search: q }; // full-text search on indexed fields

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


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the product by id
    console.log("id : ",id)
    const product = await Product.findById( id );
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let categoryData = null;

    // Fetch category from category service
    try {
      // const categoryServiceUrl = `http://localhost:8082/api/category/laptops-1760193729233`;
      console.log(process.env.BASEURL + "category/" +product.category)
      const categoryServiceUrl =process.env.BASEURL + "category/" +product.category;

      const response = await axios.get(categoryServiceUrl);
      categoryData = response.data.name;

      console.log("categorydata :",categoryData)
    } catch (error) {
      console.error("Category fetch error:", error.message);
      categoryData = "Uncategorized";
    }

    // Merge product data with full category info
    const result = {
      ...product.toObject(), // cleaner than _doc
      category: categoryData,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};



const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate( id , updates, {
      new: true,
      runValidators: true,
    });
        console.log(updatedProduct);

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete( id );

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({
      msg: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const updateProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars } = req.body; // 1–6

    if (!stars || stars < 1 || stars > 6)
      return res.status(400).json({ msg: "Invalid rating value" });

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { [`ratings.${stars}`]: 1 } }, // increment proper star
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({
      msg: `⭐ ${stars}-star rating added successfully`,
      product,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductRating,
};

import productModel from "../models/product-model.js";
import orderModel from "../models/order-model.js"
import User from "../models/user-model.js";
import { fileUpload, fileDelete } from "../middleware/fileUpload.js";


 export const addRatingForProducts = async (req, res) => {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;
  
    try {
      const product = await productModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Add the new rating to the ratings array
      product.ratings.push({ user: userId, rating, comment });
  
      // Update totalRatings and recalculate averageRating
      product.totalRatings += 1;
      product.averageRating =
        (product.averageRating * (product.totalRatings - 1) + rating) /
        product.totalRatings;
  
      await product.save();
  
      res.status(200).json({
        message: "Rating added successfully",
        averageRating: product.averageRating,
        totalRatings: product.totalRatings,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  //get products added by a  seller
  export const getSellerProducts = async (req, res) => {
    try {
      // Assuming req.user.id is set by your authentication middleware to the seller's user ID
      const sellerId = req.userId;
  
      // Find products with creator field matching the seller's ID
      const products = await productModel.find({ creator: sellerId });
  
      // If no products are found, return a 404 error
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found for this seller" });
      }
  
      // Respond with the seller's products
      res.status(200).json({ products });
    } catch (err) {
      console.log("Error from seller:", err.message);
      res.status(500).json({ message: err.message });
    }
  };



  //get all products of all sellers
  export const getAllProducts = async (req, res) => {
    try {
      // Fetch all products with their creator info, filtering for farmers only
      const allProducts = await productModel
        .find()
        
  
        console.log("hello from dil")
      // Filter out products where the creator is not a farmer
      const filteredProducts = allProducts.filter(product => product.creator !== null);
  
      // If no products are found, return a 404 error
      if (!filteredProducts || filteredProducts.length === 0) {
        return res.status(404).json({ message: "No products found from farmers", success: false });
      }
  
      // Respond with the filtered products
      res.status(200).json({
        products: filteredProducts,
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  };

   //get seller added single  products
  export const getSellerSingleProduct = async (req, res) => {
    try {
      // Find the product by its ID
      const product = await productModel.findById(req.params.productId).populate("creator");
  
      // If no product is found, return a 404 error
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Return the found product in the response
      res.status(200).json({
        message:"successfully retrieved product",

        product,
        success:true
      });
    } catch (err) {
      // Handle any errors that occur during the query
      res.status(500).json({ message: err.message });
    }
  };
  

//add product to cart
export const cartProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await productModel.findById(req.params.productId);
    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    // Find the user by ID from the middleware
    const userExist = await User.findById(req.user.id); // Assuming middleware sets req.user.id
    if (!userExist) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Check if product is already in the user's cart
    const index = userExist.cart.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (index >= 0) {
      // If the product is already in the cart, update the quantity
      userExist.cart[index].quantity = req.body.quantity;
    } else {
      // If the product is not in the cart, add it with the specified quantity
      userExist.cart.push({
        product: product._id,
        quantity: req.body.quantity,
      });
    }

    // Save the updated user object
    await userExist.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: userExist.cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const buyProduct = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNo: req.params.phoneNo,
    }).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderProducts = user.cart
      .filter((cartItem) => cartItem.quantity > 0)
      .map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
        status: "process",
        sellerId: cartItem.product.creator,
      }));

    const purchasedOrderProducts = {
      products: orderProducts,
      userId: user._id,
      userAddress: req.body.userAddress,
      userName: req.body.userName,
      userPhoneNo: req.body.userPhoneNo,
      contractAddress: req.body.contractAddress,
      web3Id: req.body.web3Id,
      paymentAmount: req.body.paymentAmount,
      date: new Date(),
    };
    const orders = await Order.create(purchasedOrderProducts);

    const purchasedProducts = user.cart.map((cartItem) => ({
      product: cartItem.product._id,
      quantity: cartItem.quantity,
    }));

    const productIds = purchasedProducts.map((product) => product.product);
    const products = await productModel.find({ _id: { $in: productIds } });

    products.forEach((product) => {
      const purchasedProduct = purchasedProducts.find(
        (purchasedProduct) =>
          purchasedProduct.product.toString() === product._id.toString()
      );

      if (purchasedProduct) {
        product.productPurchased.push({
          buyer: user._id,
          quantity: purchasedProduct.quantity,
        });
      }
    });
    user.purchased.push(...purchasedProducts);

    user.cart = [];
    await Promise.all([
      user.save(),
      ...products.map((product) => product.save()),
    ]);

    await user.save();

    res.status(200).json({ message: "Purchase successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};



export const addProduct = async (req, res) => {
  try {
    // Assuming the userId is added to req.user by middleware
    const userId = req.userId;

    // Find the seller by userId
    const seller = await User.findById(userId);
    console.log(seller);

    // If no seller is found, send an error response
    if (!seller) {
      return res.status(404).json({ message: "Seller not found", success: false });
    }

    // Create the product using the seller's data
    const product = await productModel.create({
      productType: req.body.productType,
      productName: req.body.productName,
      description: req.body.description,
      productPacked: req.body.productPacked,
      productExpire: req.body.productExpire,
      productPrice: req.body.productPrice,
      web3Id: req.body.web3Id,
      contractAddress: req.body.contractAddress,
      creator: userId, // Set the creator to the seller's ID
      productImageUrl: req.body.imageUrl, // Assuming you are using multer for file upload
    });

    // Save the product
    await product.save();

    // Add the product's ID to the seller's list of products
    seller.products.push(product._id); // Use product._id instead of the entire product
    await seller.save();

    // Send success response
    res.status(200).json({ message: "Product Successfully Added", success: true });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Server error", success: false });
  }
};

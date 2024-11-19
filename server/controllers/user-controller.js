// Register a new user
import User from "../models/user-model.js";

import bcrypt, { compareSync } from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookie from "cookie"
import orderModel from "../models/order-model.js";
import { ObjectId } from "mongoose";


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, walletAddress, address } = req.body;
    if (!fullname || !email || !password || !role || !walletAddress || !address) {
      return res.status(400).json({
        message: "Something is missing, please provide all required fields",
        success: false,
      });
    }
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use', success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      walletAddress,
      address,
    });

    console.log("hello");
    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', success: true, role });
  } catch (error) {
    console.error(error); // Log the error to understand what’s going wrong
    res.status(500).json({ message: 'Server error', success: false });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`role from controller ${role}`)

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
        success: false,
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    // Compare the passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    // Check if the provided role matches the user's role
    if (user.role !== role) {
      return res.status(400).json({
        message: `Role mismatch: expected ${user.role} but got ${role}`,
        success: false,
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, // Secret for signing the token
      { expiresIn: '1h' } // Token expiration
    );

    // Check user role and prepare the message accordingly
    let roleMessage = '';
    if (user.role === 'admin') {
      roleMessage = 'Welcome back, admin!';
    } else if (user.role === 'farmer') {
      roleMessage = 'Welcome back, farmer!';
    } else if (user.role === 'buyer') {
      roleMessage = 'Welcome back, buyer!';
    }

    // Send response with token in a cookie
    return res
      .status(200)
      .cookie("fresh", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // JavaScript cannot access this cookie
        sameSite: 'strict', // CSRF protection
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      })
      .json({
        message: roleMessage,
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error', success: false });
  }
};


export const logout=async(req,res)=>{
  try {
    return res.status(200).cookie("fresh", "", {maxAge:0}).json({
      message:"Logged Out Successfully ",
      success:true
    })
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error', success: false });
  }
}



export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Define allowed fields for updates, including password
    const allowedUpdates = ["fullname", "email", "phoneNumber", "walletAddress", "address", "password"];
    const updates = Object.keys(req.body).reduce((obj, key) => {
      if (allowedUpdates.includes(key)) {
        obj[key] = req.body[key];
      }
      return obj;
    }, {});

    // Hash the password if it's being updated
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Find and update the user by userId
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true, // Enforces schema validations on update
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    // Get the userId from the middleware (it's assumed that req.userId is populated by the middleware)
    const userId = req.userId;

    // Find orders for the user
    const orders = await orderModel.find({ userId: userId })
      .populate("products.product"); // Populate the product details

    if (!orders || orders.length === 0) {
      return res.status(400).json({
        message: "Empty Order",
      });
    }

    // Respond with the orders
    return res.status(200).json({
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    // Get userId from middleware (assuming it's added to `req.userId`)
    const userId = req.userId;

    // Find the user and populate the cart with product details
    const user = await User.findById(userId).populate("cart.product");

    // Check if user is found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return the cart items
    res.status(200).json({
      message: "Cart items fetched successfully",
      cart: user.cart,
      success:true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};


export const getAllOrderEachProduct = async (req, res) => {
  try {
    // Assuming req.user.userId is set by the middleware for authenticated users
    const sellerWithProducts = await Seller.findOne({
      userId: req.user.userId,
    }).populate("products");

    if (!sellerWithProducts) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Directly include each product's purchases without counting them
    const productsWithPurchases = sellerWithProducts.products.map((product) => {
      return {
        ...product.toObject(),
        productPurchased: product.productPurchased, // Full details of each purchase
      };
    });

    res.status(200).json({
      products: productsWithPurchases,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrderFarmers = async (req, res) => {
  try {
    // Use userId from middleware (assuming req.userId is set by the middleware)
    const seller = await Seller.findOne({ userId: req.userId });

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Find all orders that include this seller's products
    const sellerOrders = await Order.find({
      "products.sellerId": seller._id,
    }).populate("products.product");

    if (!sellerOrders || sellerOrders.length === 0) {
      return res.status(400).json({
        message: "No orders found",
      });
    }

    // Filter products associated with this specific seller
    const sellerOrderProducts = sellerOrders.flatMap((order) =>
      order.products.filter(
        (product) => product.sellerId.toString() === seller._id.toString()
      )
    );

    // Construct response
    return res.status(200).json({
      orders: sellerOrderProducts,
      sellerInfo: {
        _id: seller._id,
        userId: seller.userId,
        userAddress: seller.userAddress,
        userName: seller.userName,
        userPhoneNo: seller.userPhoneNo,
        contractAddress: seller.contractAddress,
        web3Id: seller.web3Id,
        paymentAmount: seller.paymentAmount,
        date: seller.date,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkToken = (req, res) => {
  try {
   
    const token = req.cookies.fresh;
    console.log("Token from cookies:", token); // Log token specifically

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);  // Log error for debugging
        return res.status(401).json({
          message: "Invalid token",
          success: false,
        });
      }

      // Token is valid, return success response
      return res.status(200).json({
        message: "Token is valid",
        success: true,
        userId: decoded.userId, 
        role: decoded.role,
      });
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



// Adjust this path based on your project structure

 // Make sure to import ObjectId if needed



 export const removeCartProduct = async (req, res) => {
   try {
     console.log("Attempting to remove from cart...");
 
     // Ensure the cartItemId parameter is valid
     const cartItemId = req.params.cartItemId;
     if (!ObjectId.isValid(cartItemId)) {
       return res.status(400).json({ message: "Invalid Cart Item ID", success: false });
     }
 
     // Find the user by ID (assuming middleware has set req.userId)
     const userExist = await User.findById(req.userId);
     if (!userExist) {
       return res.status(400).json({ message: "User Not Found", success: false });
     }
 
     console.log("User found:", userExist._id);
     console.log("User Cart:", userExist.cart);
 
     // Find the index of the product in the cart
     const productIndex = userExist.cart.findIndex(
       (item) => item.product.toString() === cartItemId
     );
 
     if (productIndex === -1) {
       return res.status(404).json({ message: "Product not found in cart", success: false });
     }
 
     console.log("Product found in cart, removing...");
 
     // Remove the product from the cart
     userExist.cart.splice(productIndex, 1);
 
     // Save the updated user object
     await userExist.save();
 
     // Respond with success
     res.status(200).json({
       message: "Product removed from cart successfully",
       cart: userExist.cart,
       success: true
     });
   } catch (err) {
     console.error("Error:", err.message);
     res.status(500).json({ message: err.message, success: false });
   }
 };
 


import orderModel from "../models/order-model.js";

export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId; // Order ID
  const productId = req.params.productId; // Product ID
  const newStatus = req.body.status; // New status value

  try {
    // Find the order and update the product status in the order
    const order = await  orderModel.findOneAndUpdate(
      { _id: orderId, "products.product": productId }, // Find order and product
      { $set: { "products.$.status": newStatus } }, // Update the status
      { new: true } // Return the updated order
    );

    // If no order or product is found, return an error
    if (!order) {
      return res.status(404).json({ message: "Order or Product not found" });
    }

    // If everything is successful, return the updated order
    res.status(200).json({ order });
  } catch (error) {
    // Handle any errors that occur during the update
    res.status(500).json({ message: error.message });
  }
};


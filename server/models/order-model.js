import { Schema as _Schema, Types, model } from 'mongoose';

const Schema = _Schema;

const orderSchema = new Schema({
  product: { // Single product for each order
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  status: { 
    type: String, 
    required: true, 
    default: 'Pending',
    enum:["Pending", "Processing", "Delivered"] // Default status for a new order
  },
  sellerId: { 
    type: Types.ObjectId, 
    required: true, 
    ref: 'Seller' 
  },
  userId: { 
    type: Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  userAddress: { 
    type: String, 
    required: true, 
  },
  userName: { 
    type: String, 
    required: true, 
  },
  userPhoneNo: { 
    type: String, 
    required: true, 
  },
  walletAddress: { // Blockchain wallet address of the buyer
    type: String,
    required: true,
  },
  contractAddress: { // Smart contract address for the transaction
    type: String,
    required: true,
  },
  web3Id: { 
    type: String, 
    required: true 
  },
  paymentAmount: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

export default model('Order', orderSchema);

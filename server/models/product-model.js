import { Schema as _Schema, Types, model } from "mongoose";

const Schema = _Schema;

const productSchema = new Schema({
  productType: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productPacked: {
    type: Date,
    required: true,
  },
  productExpire: {
    type: Date,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  web3Id: {
    type: String,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
  creator: { type: Types.ObjectId, required: true, ref: "Seller" },
  productPurchased: [
    {
      buyer: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  farmLocation: String,
  processingFacility: String,
  packagingFacility: String,
  shipmentLocation: String,
  deliveryLocation: String,
  productDates: {
    plantingDate: Date,
    harvestDate: Date,
    processingDate: Date,
    packagingDate: Date,
    shipmentDate: Date,
  },
  ratings: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, 
      },
      comment: String,
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
});

export default model("Product", productSchema);

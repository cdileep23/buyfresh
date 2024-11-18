import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["farmer", "buyer"],
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      { type: Types.ObjectId, ref: "Product" } 
    ],
    cart: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          
        },
        quantity: { type: Number, required: true },
      },
    ],
    purchased: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerClerkId: { type: String, required: true, ref: "Buyer" },
  farmerClerkId: { type: String, required: true, ref: "Farmer" },
  crop: { type: Object, required: false },     // Store crop details as plain object
  sapling: { type: Object, required: false },  // Store sapling details
  fish: { type: Object, required: false },     // Store fish details
  status: {
    type: String,
    enum: ["pending", "accepted", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: { type: Date, default: Date.now },
  paymentId: { type: String },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

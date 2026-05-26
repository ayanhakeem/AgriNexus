import mongoose from "mongoose";

const { Schema } = mongoose;

const fishSchema = new Schema({
  name: { type: String, required: true }, // e.g., Catfish, Tilapia, Rohu
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }, // in kg or count
  location: { type: String, required: true },
  farmerClerkId: { type: String, required: true, ref: "Farmer" },
  image: { type: String, default: null },
  harvestDate: { type: Date }, // Expected date of harvest
  status: { 
    type: String, 
    enum: ["available", "pre-book", "sold-out"], 
    default: "available" 
  },
  description: { type: String }
}, { timestamps: true });

const Fish = mongoose.model("Fish", fishSchema);
export default Fish;

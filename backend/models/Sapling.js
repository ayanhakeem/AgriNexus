import mongoose from "mongoose";

const { Schema } = mongoose;

const saplingSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Fruit, Timber, Ornamental
  age: { type: String }, // e.g., "6 months", "1 year"
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  nurseryName: { type: String, required: true },
  farmerClerkId: { type: String, required: true, ref: "Farmer" },
  image: { type: String, default: null },
  description: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

saplingSchema.index({ location: 1 });
saplingSchema.index({ farmerClerkId: 1 });
saplingSchema.index({ name: 1 });

const Sapling = mongoose.model("Sapling", saplingSchema);
export default Sapling;

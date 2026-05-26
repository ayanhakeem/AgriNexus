import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  certificationBody: String,
  certificateNumber: String,
  certificationDate: Date,
  expiryDate: Date,
  verified: Boolean,
  documentUrl: String,
});

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  certified: { type: Boolean, default: false },
  certificationDetails: certificationSchema,
  clerkId: String,
}, { collection: "equipment" });

equipmentSchema.index({ name: 1 });
equipmentSchema.index({ clerkId: 1 });

const Equipment = mongoose.models.Equipment || mongoose.model("Equipment", equipmentSchema);

export default Equipment;

import express from "express";
import Sapling from "../models/Sapling.js";
import Farmer from "../models/farmerModel.js";
import { translateArray } from "../utils/translateData.js";

const nurseryRouter = express.Router();

// 1. Add sapling (by nursery/farmer)
nurseryRouter.post("/add", async (req, res) => {
  try {
    const { name, type, age, price, quantity, location, nurseryName, farmerClerkId, image, description, coordinates } = req.body;
    
    const sapling = new Sapling({
      name,
      type,
      age,
      price,
      quantity,
      location,
      nurseryName,
      farmerClerkId,
      image: image || null,
      description,
      coordinates
    });
    
    await sapling.save();

    // Optionally add to farmer's list if we add a 'saplings' array to Farmer model later
    // For now, we query by farmerClerkId

    res.status(201).json({ message: "Sapling added successfully", sapling });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Fetch all saplings (Marketplace)
nurseryRouter.get("/all", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const saplings = await Sapling.find({}).sort({ createdAt: -1 }).lean();
    const translatedSaplings = await translateArray(saplings, lang);
    res.json(translatedSaplings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Fetch saplings by location (Nearby search)
nurseryRouter.get("/search", async (req, res) => {
  try {
    const { city, lang = "en" } = req.query;
    const query = city ? { location: new RegExp(city, 'i') } : {};
    const saplings = await Sapling.find(query).lean();
    const translatedSaplings = await translateArray(saplings, lang);
    res.json(translatedSaplings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Fetch saplings by a specific nursery/farmer
nurseryRouter.get("/farmer/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const saplings = await Sapling.find({ farmerClerkId: clerkId }).lean();
    res.json(saplings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Update sapling
nurseryRouter.put("/:saplingId", async (req, res) => {
  try {
    const { saplingId } = req.params;
    const sapling = await Sapling.findByIdAndUpdate(saplingId, req.body, { new: true });
    if (!sapling) return res.status(404).json({ message: "Sapling not found" });
    res.json({ message: "Sapling updated successfully", sapling });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Delete sapling
nurseryRouter.delete("/:saplingId", async (req, res) => {
  try {
    const { saplingId } = req.params;
    const { requesterId } = req.body;
    const adminId = "user_2mZ19nK8i7O5eF8E1Pz9Q7z6z2O";

    const sapling = await Sapling.findById(saplingId);
    if (!sapling) return res.status(404).json({ message: "Sapling not found" });

    if (sapling.farmerClerkId !== requesterId && requesterId !== adminId) {
      return res.status(403).json({ message: "Unauthorized: Only the owner can delete this sapling" });
    }

    await Sapling.findByIdAndDelete(saplingId);
    res.json({ message: "Sapling deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { nurseryRouter };

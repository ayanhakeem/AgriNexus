import express from "express";
import Fish from "../models/Fish.js";

const fishRouter = express.Router();

// 1. Add fish listing
fishRouter.post("/add", async (req, res) => {
  try {
    const { name, price, quantity, location, farmerClerkId, image, harvestDate, status, description } = req.body;
    
    const fish = new Fish({
      name,
      price,
      quantity,
      location,
      farmerClerkId,
      image: image || null,
      harvestDate,
      status: status || "available",
      description
    });
    
    await fish.save();
    res.status(201).json({ message: "Fish listing added successfully", fish });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Fetch all fish (Marketplace)
fishRouter.get("/all", async (req, res) => {
  try {
    const fishList = await Fish.find({}).sort({ createdAt: -1 }).lean();
    res.json(fishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2.5 Search fish by city
fishRouter.get("/search", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City query is required" });
    
    const fishList = await Fish.find({
      location: { $regex: city, $options: "i" }
    }).sort({ createdAt: -1 }).lean();
    
    res.json(fishList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update fish status (e.g., when pre-booked)
fishRouter.put("/:fishId/status", async (req, res) => {
  try {
    const { fishId } = req.params;
    const { status } = req.body;
    
    const fish = await Fish.findByIdAndUpdate(fishId, { status }, { new: true });
    if (!fish) return res.status(404).json({ message: "Fish listing not found" });
    
    res.json({ message: "Fish status updated", fish });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Fetch fish by farmer
fishRouter.get("/farmer/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const fishList = await Fish.find({ farmerClerkId: clerkId });
    res.json(fishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Delete fish listing
fishRouter.delete("/:fishId", async (req, res) => {
  try {
    const { fishId } = req.params;
    const { requesterId } = req.body;
    const adminId = "user_2mZ19nK8i7O5eF8E1Pz9Q7z6z2O";

    const fish = await Fish.findById(fishId);
    if (!fish) return res.status(404).json({ message: "Fish listing not found" });

    if (fish.farmerClerkId !== requesterId && requesterId !== adminId) {
      return res.status(403).json({ message: "Unauthorized: Only the owner can delete this listing" });
    }

    await Fish.findByIdAndDelete(fishId);
    res.json({ message: "Fish deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Update full fish listing
fishRouter.put("/:fishId", async (req, res) => {
  try {
    const { fishId } = req.params;
    const fish = await Fish.findByIdAndUpdate(fishId, req.body, { new: true });
    if (!fish) return res.status(404).json({ message: "Fish listing not found" });
    res.json({ message: "Fish listing updated successfully", fish });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { fishRouter };

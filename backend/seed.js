import mongoose from "mongoose";
import Sapling from "./models/Sapling.js";
import Fish from "./models/Fish.js";
import Farmer from "./models/farmerModel.js";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    // Get a farmer to associate the data with
    const farmer = await Farmer.findOne({});
    const clerkId = farmer ? farmer.clerkId : "user_2p8X5q7k9v3n1m4j6h8g0f2d4s";

    // Sample Saplings
    const saplings = [
      {
        name: "Premium Alphonso Mango",
        type: "Fruit",
        age: "1 year",
        price: 250,
        quantity: 100,
        location: "Bangalore",
        nurseryName: "Green Valley Nursery",
        farmerClerkId: clerkId,
        image: "https://plus.unsplash.com/premium_photo-1661326248013-3107a4b2bd91?q=80&w=2070&auto=format&fit=crop",
        description: "Grafted Alphonso mango saplings. High yield and disease resistant.",
        coordinates: { lat: 12.9716, lng: 77.5946 }
      },
      {
        name: "Hybrid Coconut (Tall)",
        type: "Fruit",
        age: "2 years",
        price: 180,
        quantity: 50,
        location: "Mysore",
        nurseryName: "Royal Palms Nursery",
        farmerClerkId: clerkId,
        image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fcd9?q=80&w=2070&auto=format&fit=crop",
        description: "Fast growing hybrid coconut trees. Yields in 4-5 years.",
        coordinates: { lat: 12.2958, lng: 76.6394 }
      }
    ];

    // Sample Fish
    const fish = [
      {
        name: "Organic Catfish (Magur)",
        price: 150,
        quantity: 500,
        location: "Hassan",
        farmerClerkId: clerkId,
        image: "https://images.unsplash.com/photo-1514173323134-c180bad182ee?q=80&w=2070&auto=format&fit=crop",
        status: "available",
        description: "Freshwater catfish fed with organic feed. Average weight 500g-1kg."
      },
      {
        name: "Tilapia (Pre-booking)",
        price: 120,
        quantity: 1000,
        location: "Tumkur",
        farmerClerkId: clerkId,
        image: "https://images.unsplash.com/photo-1534483507429-17403c73751d?q=80&w=2070&auto=format&fit=crop",
        harvestDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: "pre-book",
        description: "High quality Tilapia. Expected harvest size 400g."
      }
    ];

    await Sapling.deleteMany({});
    await Fish.deleteMany({});

    await Sapling.insertMany(saplings);
    await Fish.insertMany(fish);

    console.log("Database seeded successfully! 🌱🐟");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();

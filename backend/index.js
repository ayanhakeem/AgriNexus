import express from "express";
import cors from "cors";
import { geminiRouter } from "./routers/geminiRouter.js";
import { buyerRouter } from "./routers/buyerRouter.js";
import { farmerRouter } from "./routers/farmerRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { equipmentRouter } from "./routers/equipmentRouter.js";
import { nurseryRouter } from "./routers/nurseryRouter.js";
import { fishRouter } from "./routers/fishRouter.js";
import { connectDB } from "./utils/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("Registering routes...");
app.use("/api/gemini", geminiRouter);
app.use("/api/buyer", buyerRouter);
app.use("/api/farmer", farmerRouter);
app.use("/api/user", userRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/nursery", nurseryRouter);
app.use("/api/fish", fishRouter);
console.log("Routes registered.");

app.get("/", (req, res) => {
  res.send("Backend running on Render 🚀");
});

const PORT = process.env.PORT || 3000;

// Connect to DB then start server — awaited so rejections are caught
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

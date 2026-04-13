import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const geminiRouter = express.Router();

// Initialize Groq (OpenAI Compatible)
const groqApiKey = process.env.GROK_API_KEY; // Keeping the variable name for now to avoid .env changes
let groq = null;

if (groqApiKey) {
    groq = new OpenAI({
        apiKey: groqApiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });
    console.log("🚀 AgriNexus Assistant: Groq (Llama 3.3) initialized");
} else {
    console.warn("⚠️ GROK_API_KEY is missing in backend/.env.");
}

// Configure multer for image upload
const upload = multer({ storage: multer.memoryStorage() });

geminiRouter.post(
  "/analyze-image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!groq) {
        return res.status(503).json({ error: "Groq API is not configured. Please add GROK_API_KEY to your backend .env file." });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No image provided!" });
      }

      const base64Image = Buffer.from(file.buffer).toString("base64");

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are AgriNexus Assistant, an agricultural expert. Please analyze this plant image. 1. Identify the plant. 2. Detect any diseases. 3. Provide a detailed description, prevention, and cure (organic and chemical).",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.mimetype};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      const caption = response.choices[0].message.content;
      res.json({ caption });
    } catch (error) {
      console.error("Error analyzing image with Groq:", error.message);
      res.status(500).json({ error: "Failed to analyze image: " + error.message });
    }
  }
);

geminiRouter.post("/chat", async (req, res) => {
  try {
    if (!groq) {
      return res.status(503).json({ error: "Groq API is not configured. Please add GROK_API_KEY to your backend .env file." });
    }

    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided!" });
    }

    // Convert history format
    const chatHistory = (history || []).map(item => ({
        role: item.role === "model" ? "assistant" : "user",
        content: item.parts[0].text
    }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
            role: "system", 
            content: "You are AgriNexus Assistant, a premium AI expert in agriculture and sustainable farming. Provide practical, accurate advice to farmers." 
        },
        ...chatHistory,
        { role: "user", content: message },
      ],
    });

    const responseText = response.choices[0].message.content;
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error with Groq chat:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

export { geminiRouter };

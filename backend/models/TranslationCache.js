import mongoose from "mongoose";

const translationCacheSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  language: { type: String, required: true },
  translatedText: { type: String, required: true },
}, { timestamps: true });

// Compound index for fast lookups
translationCacheSchema.index({ originalText: 1, language: 1 }, { unique: true });

const TranslationCache = mongoose.model("TranslationCache", translationCacheSchema);
export default TranslationCache;

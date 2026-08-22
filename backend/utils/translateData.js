import OpenAI from "openai";
import TranslationCache from "../models/TranslationCache.js";
import dotenv from "dotenv";

dotenv.config();

const groqApiKey = process.env.GROK_API_KEY;
let groq = null;

if (groqApiKey) {
  groq = new OpenAI({
    apiKey: groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

// Fields that should be translated dynamically
const TRANSLATABLE_FIELDS = ["name", "description", "location", "variety", "type", "nurseryName"];

/**
 * Translates specific string fields in an array of objects to the target language.
 * Uses a MongoDB cache to minimize LLM calls.
 * 
 * @param {Array} dataArray - The array of objects (e.g., crops, fishes)
 * @param {String} lang - Target language code (e.g., 'kn' for Kannada)
 * @returns {Array} - The translated array of objects
 */
export const translateArray = async (dataArray, lang) => {
  if (!lang || lang === "en" || dataArray.length === 0 || !groq) {
    return dataArray;
  }

  try {
    // 1. Collect all unique string values that need translation
    const stringsToTranslate = new Set();
    dataArray.forEach(item => {
      TRANSLATABLE_FIELDS.forEach(field => {
        if (item[field] && typeof item[field] === "string" && item[field].trim().length > 0) {
          stringsToTranslate.add(item[field].trim());
        }
      });
    });

    const uniqueStrings = Array.from(stringsToTranslate);
    if (uniqueStrings.length === 0) return dataArray;

    // 2. Check the cache
    const cachedDocs = await TranslationCache.find({
      language: lang,
      originalText: { $in: uniqueStrings }
    });

    const translationMap = {};
    cachedDocs.forEach(doc => {
      translationMap[doc.originalText] = doc.translatedText;
    });

    // 3. Find missing translations
    const missingStrings = uniqueStrings.filter(str => !translationMap[str]);

    // 4. Translate missing strings using Groq LLM
    if (missingStrings.length > 0) {
      console.log(`Translating ${missingStrings.length} new strings to ${lang}...`);
      
      const prompt = `
You are a professional translator. Translate the following English agricultural terms/phrases into Kannada.
Respond ONLY with a valid JSON object mapping the exact original English string to the translated Kannada string.
Do not include markdown blocks, explanations, or any other text outside the JSON.

Strings to translate:
${JSON.stringify(missingStrings, null, 2)}
      `.trim();

      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });

      const responseText = response.choices[0].message.content.trim();
      
      try {
        // Strip out any potential markdown backticks that the LLM might have included
        const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const newTranslations = JSON.parse(jsonStr);

        const cacheEntries = [];
        for (const [original, translated] of Object.entries(newTranslations)) {
          if (translated && typeof translated === "string") {
            translationMap[original] = translated;
            cacheEntries.push({
              originalText: original,
              language: lang,
              translatedText: translated
            });
          }
        }

        // Save new translations to cache
        if (cacheEntries.length > 0) {
          await TranslationCache.insertMany(cacheEntries, { ordered: false }).catch(err => {
            console.error("Error caching translations (might be duplicates):", err.message);
          });
        }
      } catch (parseError) {
        console.error("Failed to parse Groq translation JSON:", parseError);
        console.error("Raw response:", responseText);
        // Fallback: return original data on parse error to avoid breaking the UI
      }
    }

    // 5. Map translations back to the data objects
    // We deep clone the array (Mongoose documents need to be converted to plain objects if they aren't already)
    const translatedData = dataArray.map(item => {
      const obj = item.toObject ? item.toObject() : { ...item };
      
      if (obj.name && typeof obj.name === 'string') {
        obj.originalName = obj.name;
      }

      TRANSLATABLE_FIELDS.forEach(field => {
        if (obj[field] && typeof obj[field] === "string") {
          const original = obj[field].trim();
          if (translationMap[original]) {
            obj[field] = translationMap[original];
          }
        }
      });
      return obj;
    });

    return translatedData;
  } catch (error) {
    console.error("Error in translateArray:", error);
    return dataArray; // Fail gracefully
  }
};

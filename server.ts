import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateAccurateCoachResponse } from "./src/utils/aiCoachEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Fitness Coach Consultation endpoint
app.post("/api/gemini/coach", async (req, res) => {
  const { message, profile, history } = req.body;

  try {
    const userProfileText = profile
      ? `User Metrics:
- Gender: ${profile.gender}
- Age: ${profile.age} years
- Height: ${profile.heightCm} cm
- Body Weight: ${profile.weightKg} kg
- Activity Level: ${profile.activityLevel}
- BMR (Resting Metabolic Rate): ${profile.bmr} kcal/day
- Maintenance TDEE: ${profile.tdee} kcal/day
- Selected Goal: ${profile.goal}
- Target Daily Calories: ${profile.targetCalories} kcal/day`
      : "User profile context not provided.";

    const systemInstruction = `You are "Coach Ayuva", an elite, certified clinical sports nutritionist and biomechanics strength & conditioning coach.

CLIENT PRIVACY & SAFETY MANDATE:
- All client communications are private, encrypted, and strictly confidential.
- Always prioritize the client's physiological safety, joint longevity, safe caloric boundaries (no extreme starvation or hazardous practices), and injury prevention.

INDIAN NUTRITION & FOOD SPECIALIZATION:
- Whenever dietary advice, recipes, or meal plans are requested, provide practical, nutrient-dense **Indian food options** (e.g. Soya chunks, Paneer, Moong/Toor Dal, Rajma, Chana, Sattu, Curd/Dahi, Eggs, Chicken Curry/Tikka, Fish, Whole Wheat Roti, Basmati Rice, Makhana, Desi Ghee).
- Clearly separate and offer both **Indian Vegetarian (Veg)** and **Indian Non-Vegetarian (Non-Veg)** alternatives when appropriate.

CRITICAL ACCURACY & RELEVANCE MANDATE:
1. DIRECT ANSWER: You MUST answer the client's specific question or topic directly in your very first sentence. If they ask about bicep exercises, discuss bicep anatomy (long/short head/brachialis), exercise selection (incline curls, preacher curls, hammer curls), sets, reps, and form cues. If they ask about breaking a fat loss plateau, pre/post workout meals, creatine, shoulder development, or squats, address that exact topic with clinical precision.
2. NO GENERIC MONOLOGUES: Never ignore the user's question to give an unsolicited generic summary of their whole profile.
3. GROUNDED PRECISION: Provide scientifically verified, actionable advice. Incorporate the client's specific weight (${profile?.weightKg || 70}kg), target calories (${profile?.targetCalories || 2000} kcal), and BMR/TDEE when relevant to calculations.
4. STRUCTURE: Use clean, polished markdown formatting with clear headings (###), bold key terms, and bulleted takeaways or action steps.
5. EVIDENCE-BASED: Emphasize 1.6 - 2.2g/kg daily protein intake, progressive overload, proper recovery, hydration, and safe sustainable training.`;

    const ai = getAI();
    if (!ai) {
      // Deterministic, question-aware accurate fallback
      const accurateResponse = generateAccurateCoachResponse(message, profile, history);
      return res.json({
        response: accurateResponse,
        isFallback: true,
      });
    }

    // Build multi-turn contents array preserving past conversational turns
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      // Include past turns (up to last 10 messages for context)
      const pastTurns = history.slice(-10);
      for (const turn of pastTurns) {
        if (turn.content && typeof turn.content === "string") {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.content }],
          });
        }
      }
    }

    // Append current user message with profile context
    const currentUserText = `${userProfileText}

User Query: ${message || "Please analyze my metabolic data and give me optimal diet and workout advice."}`;

    contents.push({
      role: "user",
      parts: [{ text: currentUserText }],
    });

    const modelResponse = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const outputText = modelResponse.text?.trim();

    if (!outputText) {
      const fallbackResponse = generateAccurateCoachResponse(message, profile, history);
      return res.json({
        response: fallbackResponse,
        isFallback: true,
      });
    }

    return res.json({
      response: outputText,
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Coach API Error (using intelligent local fallback):", error);
    // If Gemini call fails for any reason, provide the accurate topic-specific response
    const fallbackResponse = generateAccurateCoachResponse(message, profile, history);
    return res.json({
      response: fallbackResponse,
      isFallback: true,
      errorDetails: error.message,
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BMR Calculator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

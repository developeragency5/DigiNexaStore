import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

interface PersonaRecommendRequest {
  persona: string;
  goal: string;
  appType: string;
  preference: string;
}

interface AppRecommendation {
  name: string;
  description: string;
  why: string;
  category: string;
  isFree: boolean;
}

router.post("/recommend", async (req, res) => {
  try {
    const { persona, goal, appType, preference } = req.body as PersonaRecommendRequest;

    if (!persona || !goal) {
      return res.status(400).json({ error: "persona and goal are required" });
    }

    const systemPrompt = `You are an expert app recommendation engine for a mobile app discovery platform called appus. 
You recommend real, popular mobile apps (available on iOS App Store or Google Play Store) based on user profiles.
Always return exactly 6 app recommendations in valid JSON format.
Each recommendation must be a real, well-known app that actually exists.
Focus on practical, highly-rated apps that genuinely solve the user's needs.`;

    const userPrompt = `Recommend the best mobile apps for a ${persona} who wants to ${goal}.
App type preference: ${appType || "any"}.
Pricing preference: ${preference || "any"}.

Return a JSON object with a "recommendations" array containing exactly 6 apps. Each app must have:
- "name": exact app name as it appears in the app stores
- "description": one sentence describing what the app does (max 15 words)
- "why": one sentence explaining why it's perfect for this ${persona} (max 20 words)
- "category": app category (e.g., Productivity, Education, Finance, etc.)
- "isFree": true or false

Focus on well-known, highly-rated apps that are genuinely useful for a ${persona}.
Return ONLY the JSON object, no other text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    let parsed: { recommendations: AppRecommendation[] };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response", raw: content });
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error("Persona recommend error:", err);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

export { router as personaRouter };

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getDivineCommentary = async (
  gameName: string,
  outcome: 'WIN' | 'LOSS',
  betAmount: number,
  payoutMultiplier: number,
  focus: number // 0 to 1, where 1 is perfect focus
): Promise<string> => {
  try {
    const resultText = outcome === 'WIN' 
      ? `won $${(betAmount * payoutMultiplier).toFixed(2)}` 
      : `lost $${betAmount.toFixed(2)}`;
    
    const focusCommentary = focus > 0.8 ? 'Their focus was unwavering.' : focus < 0.3 ? 'Their hand trembled with doubt.' : 'Their offering was adequate.';
      
    const prompt = `You are Thoth, the Egyptian god of wisdom and the witty announcer for a divine casino. A mortal just performed a ritual to influence the game '${gameName}' and ultimately ${resultText}. ${focusCommentary} Announce the result with a short, clever message of no more than 15 words that connects their focus to the outcome. Your tone is that of an ancient being amused by this cosmic power struggle. Do not break character.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 1,
      }
    });
    
    return response.text.trim().replace(/"/g, ""); // Remove quotes from response
  } catch (error) {
    console.error("Error fetching divine commentary from Gemini API:", error);
    if (outcome === 'WIN') {
        return "The gods smile upon you... for now.";
    }
    return "Fate is a cruel scribe.";
  }
};

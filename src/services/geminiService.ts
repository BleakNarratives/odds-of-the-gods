import { GoogleGenAI, Modality, Type } from "@google/genai";
import { SurveyQuestion } from "../types";

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
  focus: number, // 0 to 1, where 1 is perfect focus
  godId?: string
): Promise<string> => {
  try {
    const resultText = outcome === 'WIN' 
      ? `won $${(betAmount * payoutMultiplier).toFixed(2)}` 
      : `lost $${betAmount.toFixed(2)}`;
    
    const focusCommentary = focus > 0.8 ? 'Their focus was unwavering.' : focus < 0.3 ? 'Their hand trembled with doubt.' : 'Their offering was adequate.';
    
    let prompt = `You are Thoth, the Egyptian god of wisdom and the witty announcer for a divine casino. A mortal just performed a ritual to influence the game '${gameName}' and ultimately ${resultText}. ${focusCommentary} Announce the result with a short, clever message of no more than 15 words that connects their focus to the outcome. Your tone is that of an ancient being amused by this cosmic power struggle. Do not break character.`;
    
    if (godId === 'sterculius') {
        prompt += " The game was for Sterculius, the god of filth. You may adopt a slightly more... earthy tone, befitting the subject matter, but maintain your intellectual superiority."
    }

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

export const getSurveyQuestion = async (): Promise<SurveyQuestion> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "As the AI Architect of a game called 'Odds of the Gods', generate one concise multiple-choice survey question for players about their game experience (e.g., favorite god, most desired feature, opinion on difficulty). Provide 4 distinct, short answers.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING,
                            description: 'The survey question for the player.',
                        },
                        answers: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: 'An array of 4 short, distinct answers to the question.',
                        },
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const surveyData = JSON.parse(jsonText);
        
        if (surveyData.question && Array.isArray(surveyData.answers) && surveyData.answers.length > 0) {
            return surveyData;
        } else {
            throw new Error("Invalid survey data format from API");
        }

    } catch (error) {
        console.error("Error fetching survey question from Gemini API:", error);
        // Return a fallback question on error
        return {
            question: "Which aspect of the game do you enjoy most?",
            answers: [
                "The different gods",
                "The variety of games",
                "The overall theme",
                "Earning souls"
            ],
        };
    }
};

export const generateCustomAsset = async (
  userImageBase64: string,
  userImageType: string,
  prompt: string,
): Promise<string> => {
  try {
    const fullPrompt = `Take the person from the user-provided image and redraw them as a divine, powerful slot machine icon. The style should be bold, iconic, and painterly, fitting for a god in a celestial casino game. Make them look like: "${prompt}". The output MUST be a square icon with a fully transparent background. Only return the final image, no text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: userImageBase64, mimeType: userImageType } },
          { text: fullPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content.parts.find(p => p.text);
      throw new Error(textPart?.text || 'Image generation failed for an unknown reason.');
    }
  } catch (error) {
    console.error("Error generating custom asset:", error);
    throw error;
  }
};

export const generateHomelessMikeImage = async (): Promise<string> => {
    try {
        const prompt = "ultra-photorealistic, gritty portrait of a homeless man named Mike. He is weathered, gaunt, with matted hair and a scraggly beard. He has a wild, knowing look in his eyes, a mix of madness and profound insight. He's sitting in a dark, dirty city alleyway next to a 5-gallon bucket. The lighting is harsh, coming from a single flickering streetlamp, casting deep shadows. The mood is bleak and unsettling. You can almost smell him. 4k, cinematic, intense detail.";
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;
    } catch (error) {
        console.error("Error generating Homeless Mike's image:", error);
        throw error;
    }
};

export const getTarotReading = async (cards: { name: string, upright: boolean }[]): Promise<string> => {
    try {
        const cardDescriptions = cards.map(c => `${c.name} (${c.upright ? 'upright' : 'reversed'})`).join(', ');
        const prompt = `You are Homeless Mike, a meth-addicted seer living in a back alley. A person just drew these tarot cards for a three-card (past, present, future) reading: ${cardDescriptions}.
        Give them a bleak, rambling, slightly unhinged, but weirdly profound reading based on these cards. Your speech is slurred and you sometimes lose your train of thought, but you always circle back to the cards' grim meaning. Your narratives are dark. Keep the response to about 100 words. Do not break character.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 1.1,
            }
        });

        return response.text.trim().replace(/"/g, "");
    } catch (error) {
        console.error("Error fetching tarot reading from Gemini API:", error);
        return "The... the threads... they're all tangled. The shiny flies are too loud today. Can't see nothin'. Try again when the screaming stops.";
    }
};

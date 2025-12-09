import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const explainAerodynamics = async (
  formulaTitle: string,
  inputs: Record<string, number>,
  result: number,
  unit: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = ai.models; // Use the models accessor

    const inputStr = Object.entries(inputs)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');

    const prompt = `
      You are an expert aerodynamics engineer and flight instructor.
      
      Context:
      The user just calculated "${formulaTitle}".
      Inputs provided: ${inputStr}.
      Result: ${result.toFixed(2)} ${unit}.

      Task:
      Provide a brief, high-level insight (max 2-3 sentences) about what this result means for the aircraft's performance. 
      Is it efficient? Dangerous? Standard? 
      Keep it professional but accessible. Do not repeat the formula. Focus on the implication.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insight available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insight temporarily unavailable.";
  }
};

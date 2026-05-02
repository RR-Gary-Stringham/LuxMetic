import { GoogleGenAI, Type } from "@google/genai";
import { DashboardCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DASHBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['metric', 'chart', 'list', 'insights', 'engagement'] },
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          visualization: { type: Type.STRING, enum: ['bar', 'line', 'pie', 'velocity', 'progress', 'metric-only'] },
          data: { type: Type.OBJECT },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          footer: { type: Type.STRING },
          width: { type: Type.STRING, enum: ['full', 'half', 'third'] },
          codeSnippet: { type: Type.STRING, description: "A MINIMAL React/Tailwind blueprint. Max 10 lines." },
          developerNotes: { type: Type.STRING, description: "Technical implementation details." }
        },
        required: ['id', 'type', 'title', 'visualization', 'data', 'codeSnippet']
      }
    }
  },
  required: ['cards']
};

export async function generateDashboard(prompt: string): Promise<DashboardCard[]> {
  const systemInstruction = `
    You are an AI Hotel Analytics Visualization Genius. You create high-fidelity dashboard prototypes for hotel performance.
    
    STYLE:
    - "Shadcn Studio" aesthetic: 2px borders, sharp corners, slate-900 shadows.
    - Palette: Slate-900 (Text/Border), Orange-500 (Primary), Indigo-500 (Secondary), Emerald-500 (Positive).
    
    OUTPUT REQUIREMENTS:
    - MOCK DATA: You MUST generate highly realistic mock data for every visualization. Since the user is not providing data, your primary job is to invent data that looks professional for a hotel dashboard.
    - codeSnippet: Provide a VERY CONCISE React + Tailwind markup fragment (max 8 lines). Focus ONLY on the core visual layout components.
    - developerNotes: brief technical advice (max 20 words).
    - data: Use accurate hotel metrics (ADR: $150-$450, RevPAR: $120-$400, Occupancy: 65%-92%).
    
    DATA STRUCTURE (STRICT):
    - For 'bar', 'line', 'velocity': data MUST be Array<{ name: string, value: number, value2?: number }>.
    - For 'pie': data MUST be Array<{ name: string, value: number }>.
    - For 'metric-only': data MUST be Object { value: string, trend: { value: number, label: string, isUp: boolean }, list?: Array<{ label: string, value: string, trend?: number }> }.
    - For 'progress': data MUST be Array<{ name: string, value: number }>.
    
    STRICT FORMATTING:
    - Return exactly 4 or 5 relevant cards.
    - DO NOT use any markdown backticks in the response.
    - Escape all double quotes inside strings.
    - IMPORTANT: Every card MUST have a valid 'data' property matching the format above. Generate rich, realistic mock numbers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: `Generate a dashboard for: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: DASHBOARD_SCHEMA,
        temperature: 0.1
      }
    });

    const text = response.text || '{"cards":[]}';
    
    // Robust parsing: extract the JSON object even if the model wraps it in noise
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned an invalid response format (no JSON object found)");
    
    const result = JSON.parse(jsonMatch[0]);
    return result.cards;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

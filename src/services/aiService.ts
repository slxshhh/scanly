import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the Scanly Studio Support Agent. Your goal is to help users create professional QR codes.
You are an expert in QR code design, scannability, and the Scanly Studio platform.

Key features of Scanly Studio you should know:
- Design Studio: Where users customize their QR codes (dots, corners, colors).
- Asset Vault: Where logged-in users save their designs to the cloud.
- Brand Assets: Users can upload logos (PNG/SVG) to the center of their QR codes.
- Export Options: PNG, JPEG, and SVG (Vector) formats are available.
- Scannability: Always advise users to keep high contrast for better reliability.

Tone: Professional, helpful, minimalist, and tech-forward.
Keep responses concise and actionable.
`;

export const aiService = {
  async sendMessage(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "I'm having trouble connecting to the studio brain. Please try again later.";
    }
  }
};


import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VisualConfig, ScriptResponse, AIModelType } from "../types";
import { getApiKey } from "./security";

/**
 * Neural Frame Analysis: Analyzes video frames for editing suggestions.
 */
export const analyzeVideoForEdit = async (base64VideoFrame: string, prompt: string, model: AIModelType = 'gemini-3-flash-preview') => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const data = base64VideoFrame.split(',')[1] || base64VideoFrame;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data, mimeType: 'image/jpeg' } },
        { text: `Analyze this frame for a professional video edit. Prompt: ${prompt}. 
                 Provide exactly: 1) suggestedCaptions, 2) smartCutPoints, 
                 3) visualEffectAdvice. Return ONLY JSON.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedCaptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          smartCutPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualEffectAdvice: { type: Type.STRING }
        },
        required: ["suggestedCaptions", "smartCutPoints", "visualEffectAdvice"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Neural Eraser: Identifies and removes watermarks or objects.
 * Uses high-speed Flash Image model.
 */
export const removeWatermark = async (base64Image: string, targetDescription: string = "watermark or logo") => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data, mimeType: 'image/jpeg' } },
        { text: `Identify the ${targetDescription} in this image and remove it completely. 
                 Fill the empty space by synthesizing a perfect background match based on surrounding textures. 
                 Maintain high cinematic fidelity.` }
      ]
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Eraser synthesis failed.");
};

/**
 * Flash Remix Engine: Transforms images/frames for previews or sequence exports.
 */
export const editImageWithNano = async (
  base64Image: string, 
  mimeType: string, 
  prompt: string, 
  model: AIModelType = 'gemini-2.5-flash-image'
) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data: data, mimeType: mimeType } },
        { text: `Precisely apply this neural transformation: ${prompt}. Maintain high cinematic fidelity.` }
      ]
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Neural remix failed.");
};

export const generateVisual = async (config: VisualConfig) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: config.model || 'gemini-2.5-flash-image',
    contents: { parts: [{ text: config.prompt }] },
    config: { imageConfig: { aspectRatio: config.aspectRatio || '16:9' } },
  });
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  throw new Error("Asset synthesis failed.");
};

export const generateSpeech = async (text: string, voice: string = 'Kore') => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const createSupportChat = (language: 'he' | 'en') => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: language === 'he' ? "ענה בעברית כיועץ עריכה מקצועי." : "Answer in English as a professional editing consultant." },
  });
};

export const autoDirectTemplate = async (templateId: string, topic: string): Promise<ScriptResponse[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a storyboard for ${templateId} about: "${topic}". JSON array only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scene: { type: Type.INTEGER },
            description: { type: Type.STRING },
            visualPrompt: { type: Type.STRING }
          },
          required: ["scene", "description", "visualPrompt"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

/**
 * Title Generator: Creates viral, catchy titles for social platforms.
 * Fixed: Export missing function and follow Type.OBJECT rules.
 */
export const generateCatchyTitle = async (context: string, platform: string) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a viral, catchy title for a ${platform} video about: "${context}". Return ONLY JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The generated catchy title."
          }
        },
        required: ["title"]
      }
    }
  });

  return JSON.parse(response.text || '{"title": "Visionary Future: AI Evolution ⚡"}');
};

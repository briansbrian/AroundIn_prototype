
import { GoogleGenAI } from "@google/genai";
import type { GeoLocation } from '../types';

export async function findNearbyPlaces(query: string, location: GeoLocation) {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // In a real app, handle this more gracefully. For this demo, we can return a mock error.
    return {
        text: "API Key not configured. Please set the API_KEY environment variable.",
        groundingChunks: []
    }
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
        text: "Sorry, I couldn't find any information. Please try again.",
        groundingChunks: []
    }
  }
}


import { GoogleGenAI } from "@google/genai";
import { Order, InventoryItem } from "../types";

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const getOpsInsights = async (orders: Order[], inventory: InventoryItem[]) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        As an Operations Analyst for BissauExpress, analyze the following data and provide 3 brief actionable insights for the London and Bissau teams.
        Orders: ${JSON.stringify(orders)}
        Inventory: ${JSON.stringify(inventory)}
        Format: Return a clean bulleted list. Focus on delivery bottlenecks, fraud risks, and stock replenishment.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const checkFraudRisk = async (order: Order) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this order for potential fraud or logistical risk. 
        Order: ${JSON.stringify(order)}
        The company allows expats in UK/Global to send food to Guinea-Bissau.
        Return a single sentence summary of the risk level (Low, Medium, High) and why.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Risk assessment unavailable.";
  }
};

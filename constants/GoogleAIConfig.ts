/**
 * Google Generative AI Configuration
 * 
 * This file contains configuration for Google's Generative AI models.
 * IMPORTANT: Never commit API keys to your repository.
 * Use environment variables in production.
 */

// Available Gemini models including new beta models
export const GEMINI_MODELS = {
  // Standard models
  GEMINI_PRO: 'gemini-pro',
  GEMINI_PRO_VISION: 'gemini-pro-vision',
  
  // Gemini 1.5 models
  GEMINI_15_PRO: 'gemini-1.5-pro',
  GEMINI_15_FLASH: 'gemini-1.5-flash',
  
  // Gemini 2.0 models - latest generation
  GEMINI_20_FLASH: 'gemini-2.0-flash',
  GEMINI_20_FLASH_LITE: 'gemini-2.0-flash-lite',
  GEMINI_20_PRO: 'gemini-2.0-pro'
};

// Replace with your actual API key
// For production, use environment variables or a secure key management system
export const GOOGLE_AI_API_KEY = 'YOUR_API_KEY'; 

// Default model to use
export const DEFAULT_MODEL = GEMINI_MODELS.GEMINI_PRO;

// For React Native/Expo, you might want to use AsyncStorage or a secure storage solution
// to store and retrieve API keys, rather than hardcoding them
export const getApiKey = async (): Promise<string> => {
  // Implementation would depend on your storage solution
  // Example with environment variables:
  return process.env.GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY;
}; 
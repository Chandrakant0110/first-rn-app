import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Define types for configuration and responses
interface GoogleAIConfig {
  apiKey: string;
  modelName: string;
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    candidateCount?: number;
  };
}

interface GenerativeAIResponse {
  text: string;
  error?: string;
}

/**
 * GoogleAI Service
 * 
 * A utility service for interacting with Google's Generative AI models,
 * including support for new beta models like Gemini 2.0-flash and Gemini 2.0-pro.
 */
class GoogleAIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private modelName: string;

  /**
   * Creates an instance of GoogleAIService.
   * 
   * @param config - Configuration for the GoogleAI service
   */
  constructor(config: GoogleAIConfig) {
    if (!config.apiKey) {
      throw new Error('Google AI API key is required');
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.modelName = config.modelName || 'gemini-pro';
    
    // Initialize the model with the specified configuration
    this.model = this.genAI.getGenerativeModel({
      model: this.modelName,
      safetySettings: config.safetySettings || this.getDefaultSafetySettings(),
      generationConfig: config.generationConfig || this.getDefaultGenerationConfig(),
    });
  }

  /**
   * Get default safety settings for the model
   */
  private getDefaultSafetySettings() {
    return [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  }
  
  /**
   * Get default generation configuration
   * Optimizes settings for each model type
   */
  private getDefaultGenerationConfig() {
    // Base configuration
    const config = {
      temperature: 0.9,
      topK: 1,
      topP: 0.95,
      maxOutputTokens: 2048,
    };
    
    // Specific optimizations for different model families
    if (this.modelName.includes('gemini-2.0')) {
      // Optimize for Gemini 2.0 models
      return {
        ...config,
        temperature: 0.4, // Lower temperature for more deterministic outputs 
        maxOutputTokens: 8192, // 2.0 models support larger outputs
      };
    } else if (this.modelName.includes('gemini-1.5')) {
      // Optimize for Gemini 1.5 models
      return {
        ...config,
        maxOutputTokens: 8192, // 1.5 models also support larger outputs
      };
    }
    
    return config;
  }

  /**
   * Generate a response from the AI model
   * 
   * @param prompt - The prompt to send to the model
   * @returns A promise that resolves to the generated text
   */
  async generateContent(prompt: string): Promise<GenerativeAIResponse> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return { text };
    } catch (error) {
      console.error('Error generating content:', error);
      return { 
        text: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Generate a response from the AI model with streaming
   * 
   * @param prompt - The prompt to send to the model
   * @param onChunk - Callback for each chunk of generated text
   * @returns A promise that completes when the stream ends
   */
  async generateContentStream(
    prompt: string, 
    onChunk: (text: string) => void
  ): Promise<void> {
    try {
      const result = await this.model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('Error in content stream:', error);
      throw error;
    }
  }

  /**
   * Start a chat session with the model
   * 
   * @param history - Optional chat history to initialize the session with
   * @returns A chat session object
   */
  startChat(history = []) {
    return this.model.startChat({
      history,
      generationConfig: this.getDefaultGenerationConfig(),
    });
  }
  
  /**
   * Check if the selected model is one of the newest Gemini 2.0 models
   * 
   * @returns True if using a Gemini 2.0 model
   */
  isUsingGemini2Model(): boolean {
    return this.modelName.includes('gemini-2.0');
  }

  /**
   * Get the current model name
   * 
   * @returns The name of the currently active model
   */
  getCurrentModelName(): string {
    return this.modelName;
  }
}

export default GoogleAIService; 
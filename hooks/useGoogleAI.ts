import { useState, useEffect, useCallback } from 'react';
import GoogleAIService from '../services/GoogleAI';
import { GEMINI_MODELS, getApiKey } from '../constants/GoogleAIConfig';

// Shared instance of the service
let googleAIService: GoogleAIService | null = null;

interface UseGoogleAIProps {
  modelName?: string;
}

interface UseGoogleAIReturn {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  generateResponse: (prompt: string) => Promise<string>;
  generateResponseStream: (prompt: string, onChunk: (text: string) => void) => Promise<void>;
  startChatSession: () => any;
}

/**
 * Custom hook for using Google's Generative AI in React components
 * 
 * @param props Optional configuration properties
 * @returns Object containing state and methods for interacting with Google's AI
 */
const useGoogleAI = (props?: UseGoogleAIProps): UseGoogleAIReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the Google AI service
  useEffect(() => {
    const initializeService = async () => {
      try {
        // Only initialize once
        if (!googleAIService) {
          const apiKey = await getApiKey();
          if (!apiKey) {
            throw new Error('Google AI API key is not configured');
          }
          
          googleAIService = new GoogleAIService({
            apiKey,
            modelName: props?.modelName || GEMINI_MODELS.GEMINI_PRO,
          });
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize Google AI service:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Google AI service');
      }
    };
    
    initializeService();
  }, [props?.modelName]);
  
  // Generate a response from the model
  const generateResponse = useCallback(async (prompt: string): Promise<string> => {
    if (!googleAIService) {
      throw new Error('Google AI service is not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await googleAIService.generateContent(prompt);
      
      if (response.error) {
        setError(response.error);
        return '';
      }
      
      return response.text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Generate a streaming response from the model
  const generateResponseStream = useCallback(async (
    prompt: string, 
    onChunk: (text: string) => void
  ): Promise<void> => {
    if (!googleAIService) {
      throw new Error('Google AI service is not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await googleAIService.generateContentStream(prompt, onChunk);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Start a chat session
  const startChatSession = useCallback(() => {
    if (!googleAIService) {
      throw new Error('Google AI service is not initialized');
    }
    
    return googleAIService.startChat();
  }, []);
  
  return {
    isLoading,
    isReady,
    error,
    generateResponse,
    generateResponseStream,
    startChatSession,
  };
};

export default useGoogleAI; 
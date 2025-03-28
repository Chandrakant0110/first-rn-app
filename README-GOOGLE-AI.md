# Google Generative AI Integration

This project includes integration with Google's Generative AI service, providing access to the latest Gemini models, including Gemini 2.0-flash and other advanced models.

## Setup Instructions

### 1. Install Required Packages

The required packages are already installed:
- `@google/generative-ai` - Google's official JavaScript/TypeScript SDK for Generative AI
- `@react-native-picker/picker` - Used for the model selection UI

### 2. Configure Your API Key

Before using the Google AI features, you need to set up your API key:

1. Go to [Google AI Studio](https://ai.google.dev/) and sign up/log in
2. Create an API key from the API keys section
3. Open `constants/GoogleAIConfig.ts` and replace the placeholder API key with your actual key:

```typescript
export const GOOGLE_AI_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

**IMPORTANT:** Never commit your API key to a public repository. For production, consider using environment variables or a secure key management solution.

### 3. Available Models

The following models are configured in `constants/GoogleAIConfig.ts`:

- **Standard Models**
  - `GEMINI_PRO` - Text-only model for general tasks
  - `GEMINI_PRO_VISION` - Multimodal model that handles text and images

- **Gemini 1.5 Models**
  - `GEMINI_15_PRO` - Advanced model with large context window 
  - `GEMINI_15_FLASH` - Fast model with 1M token context window

- **Gemini 2.0 Models (Latest)**
  - `GEMINI_20_FLASH` - Next-gen model with superior speed and multimodal capabilities
  - `GEMINI_20_FLASH_LITE` - Optimized for cost efficiency and low latency
  - `GEMINI_20_PRO` - Most advanced model with strong reasoning capabilities

### 4. Usage in Components

#### Basic Usage

```typescript
import useGoogleAI from '../hooks/useGoogleAI';
import { GEMINI_MODELS } from '../constants/GoogleAIConfig';

const MyComponent = () => {
  // Initialize with a specific model
  const { generateResponse, isLoading, error } = useGoogleAI({
    modelName: GEMINI_MODELS.GEMINI_20_FLASH,
  });

  const handleGenerateContent = async () => {
    try {
      const response = await generateResponse('Tell me about quantum computing');
      console.log(response);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    // Your component JSX
  );
};
```

#### Streaming Responses

```typescript
const handleStreamContent = async () => {
  try {
    await generateResponseStream('Write a short story', (chunk) => {
      console.log('Received chunk:', chunk);
      // Update UI with each chunk
    });
  } catch (err) {
    console.error('Error in stream:', err);
  }
};
```

#### Chat Functionality

```typescript
const { startChatSession } = useGoogleAI();

const startChat = async () => {
  const chatSession = startChatSession();
  
  // Send a message to the chat
  const result = await chatSession.sendMessage('Hello, how can you help me?');
  console.log(result.response.text());
  
  // Continue the conversation
  const followUp = await chatSession.sendMessage('Tell me more about that');
  console.log(followUp.response.text());
};
```

## Demo Screen

A demo screen is included at `/app/google-ai.tsx` that showcases how to use the various models. It includes:

- Model selection dropdown
- Information about each model's capabilities
- Text input for entering prompts
- Sample prompts for each model type
- Support for both standard and streaming responses

## Advanced Configuration

For advanced configuration options, see the `GoogleAIService` class in `services/GoogleAI.ts`. You can customize:

- Safety settings
- Generation parameters (temperature, top-k, top-p, etc.)
- Response format

## Troubleshooting

If you encounter issues:

1. **API Key Errors**: Make sure your API key is set correctly in `GoogleAIConfig.ts`
2. **Model Availability**: Not all models might be available to all users. Check the Google AI documentation for current availability.
3. **Rate Limiting**: Be aware of rate limits on the free tier of Google AI API.

## Resources

- [Google AI Documentation](https://ai.google.dev/docs)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://ai.google.dev/) 
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useGoogleAI from '../hooks/useGoogleAI';
import { GEMINI_MODELS } from '../constants/GoogleAIConfig';
import GoogleAIService from '../services/GoogleAI';

const GoogleAIDemo = () => {
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS.GEMINI_PRO);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelInfo, setModelInfo] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize the Google AI hook with the selected model
  const { isLoading, isReady, error, generateResponse, generateResponseStream } = useGoogleAI({
    modelName: selectedModel,
  });

  // Get model capabilities info when model changes
  useEffect(() => {
    if (isReady) {
      updateModelInfo();
    }
  }, [selectedModel, isReady]);

  // Update model info based on selected model
  const updateModelInfo = () => {
    let info = '';
    
    if (selectedModel.includes('gemini-2.0')) {
      info = '✨ Gemini 2.0 Model: Advanced capabilities with 1M token context window, native tool use, and multimodal features.';
    } else if (selectedModel.includes('gemini-1.5')) {
      info = '✨ Gemini 1.5 Model: Improved capabilities with 1M token context window and multimodal support.';
    } else if (selectedModel.includes('gemini-pro-vision')) {
      info = '✨ Vision Model: Can process text and images together.';
    } else {
      info = '✨ Standard Model: Text-based AI with strong reasoning capabilities.';
    }
    
    setModelInfo(info);
  };

  // Handle model selection change
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  // Handle generating a response
  const handleGenerateResponse = async () => {
    if (!prompt.trim()) return;
    
    setResponse('');
    setStreamingResponse('');
    
    try {
      const result = await generateResponse(prompt);
      setResponse(result);
    } catch (err) {
      console.error('Error generating response:', err);
      Alert.alert('Error', 'Failed to generate response. Please check your API key and try again.');
    }
  };

  // Handle streaming response
  const handleStreamResponse = async () => {
    if (!prompt.trim()) return;
    
    setResponse('');
    setStreamingResponse('');
    setIsStreaming(true);
    
    try {
      await generateResponseStream(prompt, (chunk) => {
        setStreamingResponse((prev) => prev + chunk);
        // Scroll to bottom with each new chunk
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    } catch (err) {
      console.error('Error streaming response:', err);
      Alert.alert('Error', 'Failed to stream response. Please check your API key and try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  // Sample prompts for different models
  const getSamplePrompt = () => {
    if (selectedModel.includes('vision')) {
      return 'Describe this image: [Note: Add image capability in your implementation]';
    } else if (selectedModel.includes('gemini-2.0')) {
      return 'Write a short story about artificial intelligence in the year 2050. Include a plot twist at the end.';
    } else {
      return 'Explain how large language models work in simple terms.';
    }
  };

  const handleUseSamplePrompt = () => {
    setPrompt(getSamplePrompt());
  };

  return (
    <View style={styles.container}>
      {/* API key warning */}
      <View style={styles.apiKeyWarning}>
        <Text style={styles.warningText}>
          ⚠️ Remember to set your API key in GoogleAIConfig.ts before testing
        </Text>
      </View>
      
      {/* Model selection */}
      <Text style={styles.label}>Select Model:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedModel}
          onValueChange={handleModelChange}
          style={styles.picker}
        >
          {Object.entries(GEMINI_MODELS).map(([key, value]) => (
            <Picker.Item key={key} label={value} value={value} />
          ))}
        </Picker>
      </View>
      
      {/* Model info */}
      {modelInfo ? (
        <View style={styles.modelInfoContainer}>
          <Text style={styles.modelInfoText}>{modelInfo}</Text>
        </View>
      ) : null}
      
      {/* Prompt input */}
      <Text style={styles.label}>Enter your prompt:</Text>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Type your prompt here..."
        multiline
        numberOfLines={3}
      />
      
      {/* Sample prompt button */}
      <TouchableOpacity
        style={styles.sampleButton}
        onPress={handleUseSamplePrompt}
      >
        <Text style={styles.sampleButtonText}>Use Sample Prompt</Text>
      </TouchableOpacity>
      
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, (!isReady || isLoading) && styles.disabledButton]}
          onPress={handleGenerateResponse}
          disabled={!isReady || isLoading}
        >
          {isLoading && !isStreaming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, (!isReady || isLoading || isStreaming) && styles.disabledButton]}
          onPress={handleStreamResponse}
          disabled={!isReady || isLoading || isStreaming}
        >
          {isStreaming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Stream</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Response display */}
      <Text style={styles.responseLabel}>
        {streamingResponse ? 'Streaming Response:' : 'Response:'}
      </Text>
      <ScrollView
        ref={scrollViewRef}
        style={styles.responseContainer}
        contentContainerStyle={styles.responseContent}
      >
        <Text style={styles.responseText}>{streamingResponse || response}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  apiKeyWarning: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  modelInfoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  modelInfoText: {
    color: '#0d47a1',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 8,
    fontSize: 16,
  },
  sampleButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  sampleButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  responseContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  responseContent: {
    padding: 12,
    minHeight: '100%',
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default GoogleAIDemo;
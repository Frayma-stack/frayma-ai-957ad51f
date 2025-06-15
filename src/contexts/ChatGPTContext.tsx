
import React, { createContext, useContext, ReactNode } from 'react';

interface ChatGPTContextType {
  generateContent: (prompt: string, options?: { maxTokens?: number; temperature?: number }) => Promise<string>;
  generateText: (prompt: string, options?: { maxTokens?: number; temperature?: number }) => Promise<string>;
  isConfigured: boolean;
}

const ChatGPTContext = createContext<ChatGPTContextType | undefined>(undefined);

export const useChatGPT = () => {
  const context = useContext(ChatGPTContext);
  if (context === undefined) {
    throw new Error('useChatGPT must be used within a ChatGPTProvider');
  }
  return context;
};

interface ChatGPTProviderProps {
  children: ReactNode;
}

export const ChatGPTProvider: React.FC<ChatGPTProviderProps> = ({ children }) => {
  const generateContent = async (prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string> => {
    try {
      console.log('🤖 ChatGPT: Starting content generation with prompt length:', prompt?.length || 0);
      
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        throw new Error('Invalid prompt provided');
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          maxTokens: options?.maxTokens || 1500,
          temperature: options?.temperature || 0.7
        }),
      });

      console.log('🤖 ChatGPT: API response status:', response.status);

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.content || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('🤖 ChatGPT: Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('🤖 ChatGPT: Raw response:', responseText.substring(0, 100) + '...');
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response received from API');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🤖 ChatGPT: JSON parse error:', parseError, 'Response:', responseText);
        throw new Error('Invalid JSON response from API');
      }
      
      if (data.error) {
        console.error('🤖 ChatGPT: API returned error:', data.error);
        throw new Error(data.content || data.error);
      }

      if (!data.content) {
        console.error('🤖 ChatGPT: No content in response:', data);
        throw new Error('No content received from API');
      }

      console.log('🤖 ChatGPT: Successfully generated content, length:', data.content.length);
      return data.content;
      
    } catch (error) {
      console.error('🤖 ChatGPT: Error generating content:', error);
      
      let errorMessage = 'Failed to generate content. Please check your configuration and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'OpenAI API key is not configured or invalid. Please check your API key configuration.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Invalid response format from API. Please try again.';
        } else if (error.message.includes('Empty response')) {
          errorMessage = 'No response received from API. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  // generateText is an alias for generateContent for backward compatibility
  const generateText = generateContent;

  // Check if API key is configured by checking if we can make a test call
  const isConfigured = true; // We'll assume it's configured since the API endpoint handles the check

  const value: ChatGPTContextType = {
    generateContent,
    generateText,
    isConfigured,
  };

  return (
    <ChatGPTContext.Provider value={value}>
      {children}
    </ChatGPTContext.Provider>
  );
};

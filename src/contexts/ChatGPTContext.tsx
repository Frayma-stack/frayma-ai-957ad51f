
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
      console.log('🤖 ChatGPT: Starting content generation with prompt length:', prompt.length);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: options?.maxTokens || 1500,
          temperature: options?.temperature || 0.7
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('🤖 ChatGPT API Error:', response.status, errorData);
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate content. Please check your configuration and try again.');
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

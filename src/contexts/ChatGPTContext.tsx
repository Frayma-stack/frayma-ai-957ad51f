
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatService } from '@/services/ChatService';

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
      
      const content = await ChatService.generateContent(prompt.trim(), options);
      
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid response received from content generation service');
      }

      if (content.trim() === '') {
        throw new Error('Empty content received from generation service');
      }

      console.log('🤖 ChatGPT: Successfully generated content, length:', content.length);
      return content;
      
    } catch (error) {
      console.error('🤖 ChatGPT: Error generating content:', error);
      
      let errorMessage = 'Failed to generate content. Please check your configuration and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'OpenAI API key is not configured or invalid. Please check your API key configuration.';
        } else if (error.message.includes('Invalid response')) {
          errorMessage = 'Invalid response format from API. Please try again.';
        } else if (error.message.includes('Empty content')) {
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

  // Check if API key is configured
  const isConfigured = !!import.meta.env.VITE_OPENAI_API_KEY;

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

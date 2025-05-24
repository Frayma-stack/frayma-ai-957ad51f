
import React, { createContext, useContext, useState } from 'react';

interface ChatGPTContextType {
  apiKey: string;
  isConfigured: boolean;
  generateContent: (prompt: string, options?: GenerateOptions) => Promise<string>;
}

interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

// This is where you would put your actual ChatGPT API key
// IMPORTANT: In a real-world application, this should be stored securely
const CHATGPT_API_KEY = "YOUR_CHATGPT_API_KEY_HERE"; // Replace with your actual API key

const ChatGPTContext = createContext<ChatGPTContextType | undefined>(undefined);

export const ChatGPTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey] = useState<string>(CHATGPT_API_KEY);
  
  // API is configured when we have a valid key
  const isConfigured = apiKey !== "YOUR_CHATGPT_API_KEY_HERE" && apiKey.trim() !== "";

  const generateContent = async (prompt: string, options: GenerateOptions = {}): Promise<string> => {
    if (!isConfigured) {
      throw new Error('ChatGPT API is not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert GTM narrative writer that creates compelling, resonant content for B2B audiences. Focus on clear, engaging storytelling that drives action.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No content generated';
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  };

  return (
    <ChatGPTContext.Provider value={{ apiKey, isConfigured, generateContent }}>
      {children}
    </ChatGPTContext.Provider>
  );
};

export const useChatGPT = (): ChatGPTContextType => {
  const context = useContext(ChatGPTContext);
  if (context === undefined) {
    throw new Error('useChatGPT must be used within a ChatGPTProvider');
  }
  return context;
};

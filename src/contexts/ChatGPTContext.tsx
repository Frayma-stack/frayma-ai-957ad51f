
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

      console.log('🤖 ChatGPT: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🤖 ChatGPT: API request failed with status:', response.status, 'Error:', errorText);
        throw new Error(`API request failed: ${errorText}`);
      }

      // Check if response body exists before trying to parse
      const responseText = await response.text();
      console.log('🤖 ChatGPT: Raw response text:', responseText?.substring(0, 100) + '...');
      
      if (!responseText || responseText.trim() === '' || responseText === 'undefined') {
        console.error('🤖 ChatGPT: Empty or undefined response received');
        throw new Error('Empty response received from API');
      }

      // Try to parse as JSON, with proper error handling
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🤖 ChatGPT: Failed to parse response as JSON:', parseError);
        console.error('🤖 ChatGPT: Raw response that failed to parse:', responseText);
        throw new Error('Invalid JSON response from API');
      }

      if (!responseData || typeof responseData !== 'object') {
        console.error('🤖 ChatGPT: Invalid response structure:', responseData);
        throw new Error('Invalid response structure from API');
      }

      const content = responseData.content || responseData.message || responseData.text;
      
      if (!content || typeof content !== 'string') {
        console.error('🤖 ChatGPT: No valid content in response:', responseData);
        throw new Error('No content received from API');
      }

      console.log('🤖 ChatGPT: Successfully generated content of length:', content.length);
      return content;
      
    } catch (error) {
      console.error('🤖 ChatGPT: Error generating content:', error);
      
      // Re-throw with a user-friendly message
      if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
      } else {
        throw new Error('Failed to generate content: Unknown error occurred');
      }
    }
  };

  // generateText is an alias for generateContent for backward compatibility
  const generateText = generateContent;

  // Check if ChatGPT is configured by checking if the API endpoint exists
  // This is a simple check - in a real app you might want to ping the API
  const isConfigured = true; // Assuming it's configured if the context is available

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

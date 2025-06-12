
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
      
      // For now, return a mock response since we don't have a working API endpoint
      // In a real implementation, you would need to set up the API endpoint properly
      const mockResponse = `# Generated Content Ideas

Based on your trigger input, here are 15 strategic content ideas that leverage Product-Led Storytelling:

## Idea 1: "The Hidden Cost of Generic AI Tools"
**Title** – Why Your AI Content Sounds Like Everyone Else's (And How to Fix It)
**Narrative** – Challenges the belief that all AI tools are created equal and that speed matters more than strategic framing.
**Product Tie-in** – Showcase how the Narrative Framing Engine provides structure that generic AI tools lack, ensuring your content reflects your unique POV.
**CTA** – Download our guide on framing AI inputs for better outputs.

## Idea 2: "The Founder's Voice Dilemma"
**Title** – Why Your Best Content Ideas Die in Translation
**Narrative** – Addresses the frustration of founders who have great insights but struggle to turn them into compelling content.
**Product Tie-in** – Highlight how ICP StoryScripts help translate founder insights into audience-relevant narratives.
**CTA** – Try our StoryScript builder for free.

## Idea 3: "Beyond the Prompt Box"
**Title** – The Strategic Gap That's Killing Your AI Content
**Narrative** – Challenges the assumption that better prompts lead to better content, focusing on the need for narrative structure.
**Product Tie-in** – Show how the 3Rs Formula provides the framework that transforms AI from a writing tool to a strategic asset.
**CTA** – Book a demo to see the 3Rs Formula in action.

[Additional ideas would continue in this format...]

*Note: This is a sample response. Please configure your API key for full functionality.*`;

      console.log('🤖 ChatGPT: Successfully generated mock content');
      return mockResponse;
      
    } catch (error) {
      console.error('🤖 ChatGPT: Error generating content:', error);
      throw new Error('Failed to generate content. Please check your configuration and try again.');
    }
  };

  // generateText is an alias for generateContent for backward compatibility
  const generateText = generateContent;

  // For now, we'll consider it configured since we're providing mock responses
  const isConfigured = true;

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

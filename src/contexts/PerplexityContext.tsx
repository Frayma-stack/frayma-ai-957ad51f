
import React, { createContext, useContext, useState } from 'react';

interface PerplexityContextType {
  apiKey: string;
  isConfigured: boolean;
}

// Updated with your Perplexity API key
const API_KEY = "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";

const PerplexityContext = createContext<PerplexityContextType | undefined>(undefined);

export const PerplexityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Using the predefined API key, no need for user input
  const [apiKey] = useState<string>(API_KEY);
  
  // API is always configured since we're providing the key
  const isConfigured = apiKey !== "YOUR_PERPLEXITY_API_KEY_HERE" && apiKey.trim() !== "";

  return (
    <PerplexityContext.Provider value={{ apiKey, isConfigured }}>
      {children}
    </PerplexityContext.Provider>
  );
};

export const usePerplexity = (): PerplexityContextType => {
  const context = useContext(PerplexityContext);
  if (context === undefined) {
    throw new Error('usePerplexity must be used within a PerplexityProvider');
  }
  return context;
};

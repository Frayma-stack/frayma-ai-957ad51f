
import React, { createContext, useContext, useState } from 'react';

interface PerplexityContextType {
  apiKey: string;
  isConfigured: boolean;
}

// This is where you would put your actual API key
// IMPORTANT: In a real-world application, this should be stored securely
const API_KEY = "YOUR_PERPLEXITY_API_KEY_HERE"; // Replace with your actual API key

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


import React, { createContext, useContext, useState } from 'react';

interface PerplexityContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const PerplexityContext = createContext<PerplexityContextType | undefined>(undefined);

export const PerplexityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with your API key - this will be the default key users will use
  // Note: Replace "YOUR_API_KEY_HERE" with your actual Perplexity API key
  const [apiKey, setApiKey] = useState<string>("YOUR_API_KEY_HERE");
  
  const isConfigured = apiKey !== "YOUR_API_KEY_HERE" && apiKey.trim() !== "";

  return (
    <PerplexityContext.Provider value={{ apiKey, setApiKey, isConfigured }}>
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

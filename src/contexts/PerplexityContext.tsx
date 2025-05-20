
import React, { createContext, useContext, useState, useEffect } from 'react';

interface PerplexityContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const PerplexityContext = createContext<PerplexityContextType | undefined>(undefined);

export const PerplexityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load from localStorage first, otherwise use default key
  const savedApiKey = localStorage.getItem('perplexity_api_key');
  const [apiKey, setApiKey] = useState<string>(savedApiKey || "YOUR_API_KEY_HERE");
  
  // Calculate if the API is properly configured
  const isConfigured = apiKey !== "YOUR_API_KEY_HERE" && apiKey.trim() !== "";

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
      localStorage.setItem('perplexity_api_key', apiKey);
    }
  }, [apiKey]);

  // Function to update API key
  const updateApiKey = (key: string) => {
    setApiKey(key);
  };

  return (
    <PerplexityContext.Provider value={{ apiKey, setApiKey: updateApiKey, isConfigured }}>
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

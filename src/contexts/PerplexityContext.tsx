import React, { createContext, useContext, useState } from "react";

interface PerplexityContextType {
  isConfigured: boolean;
  analyzeProfile: (systemPrompt: string, userPrompt: string) => Promise<any>;
}

interface PerplexityRequestBody {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
  top_p: number;
  return_images: boolean;
  return_related_questions: boolean;
  search_recency_filter: string;
  search_domain_filter: string[];
  return_citations: boolean;
  frequency_penalty: number;
  presence_penalty: number;
}

const PERPLEXITY_API_KEY = "";
const PerplexityContext = createContext<PerplexityContextType | undefined>(
  undefined
);

export const PerplexityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  function buildRequestBody(
    systemPrompt: string,
    userPrompt: string
  ): PerplexityRequestBody {
    return {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content:
            systemPrompt +
            '\n\nIMPORTANT: The user will provide actual LinkedIn profile content below. Do NOT search online. Analyze ONLY the provided LinkedIn content and extract professional experiences in the EXACT format "Title @Company | Duration". Focus on work experience, education, and professional background. If information is not available in the provided content, leave those fields empty.',
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "month",
      search_domain_filter: [],
      return_citations: false,
      frequency_penalty: 1,
      presence_penalty: 0,
    };
  }

  const [apiKey] = useState<string>(PERPLEXITY_API_KEY);

  const isConfigured =
    apiKey !== "YOUR_PERPLEXITY_API_KEY_HERE" && apiKey.trim() !== "";

  const analyzeProfile = async (
    systemPrompt: string,
    userPrompt: string
  ): Promise<any> => {
    if (!isConfigured) throw new Error("Perplexity API is not configured");

    const requestBody = buildRequestBody(systemPrompt, userPrompt);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Frayma-LinkedIn-Analysis/1.0",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(
      "Perplexity API success response received for LinkedIn analysis"
    );

    return data;
  };

  return (
    <PerplexityContext.Provider value={{ isConfigured, analyzeProfile }}>
      {children}
    </PerplexityContext.Provider>
  );
};

export const usePerplexity = (): PerplexityContextType => {
  const context = useContext(PerplexityContext);
  if (context === undefined)
    throw new Error("usePerplexity must be used within a PerplexityProvider");

  return context;
};

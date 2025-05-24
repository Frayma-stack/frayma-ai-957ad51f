
import { useState } from 'react';
import { SuccessStoryPromptConfig, SuccessStoryPromptTemplate, SuccessStoryPromptCategory } from '@/types/successStoryPrompts';
import { DEFAULT_SUCCESS_STORY_PROMPTS } from './prompts';

export const useSuccessStoryPromptConfig = () => {
  const [prompts, setPrompts] = useState<Record<SuccessStoryPromptCategory, SuccessStoryPromptTemplate>>(
    DEFAULT_SUCCESS_STORY_PROMPTS
  );

  const getPromptByCategory = (category: SuccessStoryPromptCategory): SuccessStoryPromptTemplate => {
    return prompts[category];
  };

  const updatePrompt = (category: SuccessStoryPromptCategory, prompt: SuccessStoryPromptTemplate) => {
    setPrompts(prev => ({
      ...prev,
      [category]: {
        ...prompt,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const resetToDefaults = () => {
    setPrompts(DEFAULT_SUCCESS_STORY_PROMPTS);
  };

  const generatePromptWithVariables = (category: SuccessStoryPromptCategory, variables: Record<string, string>): string => {
    const prompt = getPromptByCategory(category);
    let processedTemplate = prompt.template;

    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value || '');
    });

    return processedTemplate;
  };

  return {
    prompts,
    getPromptByCategory,
    updatePrompt,
    resetToDefaults,
    generatePromptWithVariables
  };
};


import { useState, useEffect } from 'react';
import { PromptCategory, PromptTemplate } from './prompts/types';
import { DEFAULT_PROMPTS } from './prompts/defaultPrompts';
import { 
  loadPromptsFromStorage, 
  savePromptsToStorage, 
  resetPromptsInStorage 
} from './prompts/storage';
import { 
  getPromptTemplate, 
  interpolateTemplate as interpolateTemplateUtil 
} from './prompts/templateUtils';

export type { PromptCategory, PromptTemplate } from './prompts/types';

export const usePromptConfig = () => {
  const [prompts, setPrompts] = useState<Record<PromptCategory, PromptTemplate>>(DEFAULT_PROMPTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedPrompts = loadPromptsFromStorage();
    if (savedPrompts) {
      setPrompts(savedPrompts);
    }
    setIsLoaded(true);
  }, []);

  const updatePrompt = (category: PromptCategory, template: Partial<PromptTemplate>) => {
    const updatedPrompts = {
      ...prompts,
      [category]: {
        ...prompts[category],
        ...template,
        updatedAt: new Date().toISOString()
      }
    };
    setPrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
  };

  const resetPrompt = (category: PromptCategory) => {
    const updatedPrompts = {
      ...prompts,
      [category]: DEFAULT_PROMPTS[category]
    };
    setPrompts(updatedPrompts);
    savePromptsToStorage(updatedPrompts);
  };

  const resetAllPrompts = () => {
    setPrompts(DEFAULT_PROMPTS);
    resetPromptsInStorage();
  };

  const importPrompts = (importedPrompts: Record<PromptCategory, PromptTemplate>) => {
    setPrompts(importedPrompts);
    savePromptsToStorage(importedPrompts);
  };

  const getPromptTemplateString = (category: PromptCategory): string => {
    return getPromptTemplate(prompts, category);
  };

  const interpolateTemplate = (category: PromptCategory, variables: Record<string, any>): string => {
    const template = getPromptTemplateString(category);
    return interpolateTemplateUtil(template, variables);
  };

  return {
    prompts,
    isLoaded,
    updatePrompt,
    resetPrompt,
    resetAllPrompts,
    importPrompts,
    getPromptTemplate: getPromptTemplateString,
    interpolateTemplate
  };
};

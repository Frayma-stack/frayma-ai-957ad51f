
import { useState, useEffect } from 'react';
import { PromptTemplate, PromptCategory } from '@/types/prompts';
import { DEFAULT_PROMPTS } from './prompts';

export const usePromptConfig = () => {
  const [prompts, setPrompts] = useState<Record<PromptCategory, PromptTemplate>>(DEFAULT_PROMPTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedPrompts = localStorage.getItem('gtm_prompts');
    if (savedPrompts) {
      try {
        setPrompts(JSON.parse(savedPrompts));
      } catch (error) {
        console.error('Error loading saved prompts:', error);
      }
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
    localStorage.setItem('gtm_prompts', JSON.stringify(updatedPrompts));
  };

  const resetPrompt = (category: PromptCategory) => {
    const updatedPrompts = {
      ...prompts,
      [category]: DEFAULT_PROMPTS[category]
    };
    setPrompts(updatedPrompts);
    localStorage.setItem('gtm_prompts', JSON.stringify(updatedPrompts));
  };

  const resetAllPrompts = () => {
    setPrompts(DEFAULT_PROMPTS);
    localStorage.setItem('gtm_prompts', JSON.stringify(DEFAULT_PROMPTS));
  };

  const importPrompts = (importedPrompts: Record<PromptCategory, PromptTemplate>) => {
    setPrompts(importedPrompts);
    localStorage.setItem('gtm_prompts', JSON.stringify(importedPrompts));
  };

  const getPromptTemplate = (category: PromptCategory): string => {
    return prompts[category]?.template || DEFAULT_PROMPTS[category].template;
  };

  const interpolateTemplate = (category: PromptCategory, variables: Record<string, any>): string => {
    let template = getPromptTemplate(category);
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      let replacement = '';
      
      if (Array.isArray(value)) {
        replacement = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        replacement = JSON.stringify(value);
      } else {
        replacement = String(value || '');
      }
      
      template = template.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    return template;
  };

  return {
    prompts,
    isLoaded,
    updatePrompt,
    resetPrompt,
    resetAllPrompts,
    importPrompts,
    getPromptTemplate,
    interpolateTemplate
  };
};

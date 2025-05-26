
import { PromptCategory, PromptTemplate } from './types';
import { DEFAULT_PROMPTS } from './defaultPrompts';

export const getPromptTemplate = (
  prompts: Record<PromptCategory, PromptTemplate>,
  category: PromptCategory
): string => {
  return prompts[category]?.template || DEFAULT_PROMPTS[category].template;
};

export const interpolateTemplate = (
  template: string,
  variables: Record<string, any>
): string => {
  let result = template;
  
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
    
    result = result.replace(new RegExp(placeholder, 'g'), replacement);
  });
  
  return result;
};

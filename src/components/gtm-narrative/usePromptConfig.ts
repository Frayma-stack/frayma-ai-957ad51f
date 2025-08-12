
import { useMemo } from 'react';
import { headlinesPrompt } from './prompts/headlinesPrompt';
import { contentTriggersPrompt } from './prompts/contentTriggersPrompt';
import { outlinePrompt } from './prompts/outlinePrompt';
import { fullArticlePrompt } from './prompts/fullArticlePrompt';

export const usePromptConfig = () => {
  const promptTemplates = useMemo(() => ({
    'frayma_headlines': headlinesPrompt,
    'content_triggers': contentTriggersPrompt,
    'frayma_outline': outlinePrompt,
    'full_article_generation': fullArticlePrompt
  }), []);

  const interpolateTemplate = (templateId: string, variables: Record<string, any>): string => {
    const template = promptTemplates[templateId as keyof typeof promptTemplates];
    
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return `Template ${templateId} not found`;
    }

    let interpolated = template.template;
    
    // Replace all variables in the template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      const stringValue = Array.isArray(value) ? value.join(', ') : String(value || '');
      interpolated = interpolated.replace(regex, stringValue);
    }
    
    // Clean up any remaining unreplaced variables
    interpolated = interpolated.replace(/{{[^}]+}}/g, '[Not provided]');
    
    return interpolated;
  };

  return {
    interpolateTemplate,
    availableTemplates: Object.keys(promptTemplates)
  };
};

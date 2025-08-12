
import { PromptCategory, PromptTemplate } from '@/types/prompts';
import { contentTriggersPrompt } from './contentTriggersPrompt';
import { headlinesPrompt } from './headlinesPrompt';
import { outlinePrompt } from './outlinePrompt';
import { fullArticlePrompt } from './fullArticlePrompt';

export const DEFAULT_PROMPTS: Record<PromptCategory, PromptTemplate> = {
  content_triggers: contentTriggersPrompt,
  headlines_generation: headlinesPrompt,
  outline_sections: outlinePrompt,
  full_article_generation: fullArticlePrompt
};

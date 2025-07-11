
import { PromptCategory, PromptTemplate } from '@/types/prompts';
import { contentTriggersPrompt } from './contentTriggersPrompt';
import { headlinesPrompt } from './headlinesPrompt';
import { outlinePrompt } from './outlinePrompt';
import { introPrompt } from './introPrompt';
import { bodyPrompt } from './bodyPrompt';
import { bodyRecraftingPrompt } from './bodyRecraftingPrompt';
import { conclusionPrompt } from './conclusionPrompt';
import { conclusionRecraftingPrompt } from './conclusionRecraftingPrompt';

export const DEFAULT_PROMPTS: Record<PromptCategory, PromptTemplate> = {
  content_triggers: contentTriggersPrompt,
  headlines_generation: headlinesPrompt,
  outline_sections: outlinePrompt,
  intro_generation: introPrompt,
  body_generation: bodyPrompt,
  body_recrafting: bodyRecraftingPrompt,
  conclusion_generation: conclusionPrompt,
  conclusion_recrafting: conclusionRecraftingPrompt
};

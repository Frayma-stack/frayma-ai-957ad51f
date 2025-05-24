
import { SuccessStoryPromptCategory, SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';
import { headlineOutlinePrompt } from './headlineOutlinePrompt';
import { introFirstSectionPrompt } from './introFirstSectionPrompt';
import { introRecraftingPrompt } from './introRecraftingPrompt';
import { bodyPrompt } from './bodyPrompt';
import { bodyRecraftingPrompt } from './bodyRecraftingPrompt';
import { conclusionPrompt } from './conclusionPrompt';
import { conclusionRecraftingPrompt } from './conclusionRecraftingPrompt';

export const DEFAULT_SUCCESS_STORY_PROMPTS: Record<SuccessStoryPromptCategory, SuccessStoryPromptTemplate> = {
  headline_outline_generation: headlineOutlinePrompt,
  intro_first_section: introFirstSectionPrompt,
  intro_recrafting: introRecraftingPrompt,
  body_sections: bodyPrompt,
  conclusion_generation: conclusionPrompt,
  full_story_assembly: {
    id: 'full-story-assembly',
    name: 'Full Story Assembly',
    description: 'Assemble complete success story from all sections',
    category: 'full_story_assembly',
    template: 'Placeholder for full story assembly prompt - combines all sections into final story',
    variables: ['ALL_SECTIONS', 'FINAL_FORMATTING_INSTRUCTIONS'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

// Export individual prompts for easy access
export {
  headlineOutlinePrompt,
  introFirstSectionPrompt,
  introRecraftingPrompt,
  bodyPrompt,
  bodyRecraftingPrompt,
  conclusionPrompt,
  conclusionRecraftingPrompt
};

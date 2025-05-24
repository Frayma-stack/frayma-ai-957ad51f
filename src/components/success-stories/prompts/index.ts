
import { SuccessStoryPromptCategory, SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';
import { headlineOutlinePrompt } from './headlineOutlinePrompt';
import { introFirstSectionPrompt } from './introFirstSectionPrompt';
import { introRecraftingPrompt } from './introRecraftingPrompt';

export const DEFAULT_SUCCESS_STORY_PROMPTS: Record<SuccessStoryPromptCategory, SuccessStoryPromptTemplate> = {
  headline_outline_generation: headlineOutlinePrompt,
  intro_first_section: introFirstSectionPrompt,
  intro_recrafting: introRecraftingPrompt,
  body_sections: {
    id: 'body-sections',
    name: 'Body Sections Generation',
    description: 'Generate body sections for success stories',
    category: 'body_sections',
    template: 'Placeholder for body sections prompt',
    variables: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  conclusion_generation: {
    id: 'conclusion-generation',
    name: 'Conclusion Generation',
    description: 'Generate conclusion for success stories',
    category: 'conclusion_generation',
    template: 'Placeholder for conclusion prompt',
    variables: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  full_story_assembly: {
    id: 'full-story-assembly',
    name: 'Full Story Assembly',
    description: 'Assemble complete success story',
    category: 'full_story_assembly',
    template: 'Placeholder for full story assembly prompt',
    variables: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

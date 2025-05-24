
export interface SuccessStoryPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: SuccessStoryPromptCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SuccessStoryPromptCategory = 
  | 'headline_outline_generation'
  | 'intro_first_section'
  | 'intro_recrafting'
  | 'body_sections'
  | 'conclusion_generation'
  | 'full_story_assembly';

export interface SuccessStoryPromptConfig {
  headlineOutlineGeneration: SuccessStoryPromptTemplate;
  introFirstSection: SuccessStoryPromptTemplate;
  introRecrafting: SuccessStoryPromptTemplate;
  bodySections: SuccessStoryPromptTemplate;
  conclusionGeneration: SuccessStoryPromptTemplate;
  fullStoryAssembly: SuccessStoryPromptTemplate;
}

export interface SuccessStoryPromptVariable {
  name: string;
  description: string;
  type: 'string' | 'array' | 'object';
  required: boolean;
}

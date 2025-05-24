
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: PromptCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PromptCategory = 
  | 'content_triggers'
  | 'headlines_generation'
  | 'outline_sections'
  | 'intro_generation'
  | 'body_generation'
  | 'body_recrafting'
  | 'conclusion_generation'
  | 'conclusion_recrafting';

export interface PromptConfig {
  contentTriggers: PromptTemplate;
  headlinesGeneration: PromptTemplate;
  outlineSections: PromptTemplate;
  introGeneration: PromptTemplate;
  bodyGeneration: PromptTemplate;
  bodyRecrafting: PromptTemplate;
  conclusionGeneration: PromptTemplate;
  conclusionRecrafting: PromptTemplate;
}

export interface PromptVariable {
  name: string;
  description: string;
  type: 'string' | 'array' | 'object';
  required: boolean;
}

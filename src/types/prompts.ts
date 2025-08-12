
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
  | 'full_article_generation';

export interface PromptConfig {
  contentTriggers: PromptTemplate;
  headlinesGeneration: PromptTemplate;
  outlineSections: PromptTemplate;
  fullArticleGeneration: PromptTemplate;
}

export interface PromptVariable {
  name: string;
  description: string;
  type: 'string' | 'array' | 'object';
  required: boolean;
}


export type PromptCategory = 
  | 'content_triggers'
  | 'headlines_generation'
  | 'outline_sections'
  | 'intro_generation'
  | 'body_generation'
  | 'conclusion_generation';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: PromptCategory;
  createdAt: string;
  updatedAt: string;
}

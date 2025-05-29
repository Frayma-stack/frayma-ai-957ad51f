export interface AuthorExperience {
  id: string;
  title: string;
  description: string;
}

export interface AuthorToneItem {
  id: string;
  tone: string;
  description: string;
}

export interface AuthorBelief {
  id: string;
  belief: string;
  description: string;
}

export interface AuthorSocialLink {
  id: string;
  type: 'linkedin' | 'x' | 'blog' | 'website' | 'other';
  url: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  company?: string;
  title?: string;
  email?: string;
  role: string;
  organization: string;
  backstory: string;
  experiences: AuthorExperience[];
  tones: AuthorToneItem[];
  beliefs: AuthorBelief[];
  socialLinks?: AuthorSocialLink[];
  clientId?: string;
}

export interface Client {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  industry?: string;
  description?: string;
  productContextId?: string;
}

export interface ProductContext {
  id: string;
  name: string;
  description: string;
  features: ProductFeature[];
  clientId: string;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
}

export interface ICPStoryScript {
  id: string;
  name: string;
  persona: string;
  needs: string;
  fears: string;
  goals: string;
  clientId?: string;
}

export interface CustomerSuccessStory {
  id: string;
  title: string;
  customerName: string;
  problem: string;
  solution: string;
  results: string;
  productContextId?: string;
}

export type NarrativeAnchorType = 'belief' | 'tone' | 'experience';

export interface NarrativeSelectionItem {
  id: string;
  content: string;
}

export interface NarrativeSelection {
  anchorType: NarrativeAnchorType;
  items: NarrativeSelectionItem[];
}


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

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  media?: any[];
}

export interface ProductUseCase {
  id: string;
  useCase: string;
  userRole: string;
  description: string;
  media?: any[];
}

export interface ProductDifferentiator {
  id: string;
  name: string;
  description: string;
  competitorComparison?: string;
  media?: any[];
}

export interface ProductContext {
  id: string;
  name: string;
  description: string;
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  clientId: string;
}

export interface ICPStoryScriptItem {
  id: string;
  content: string;
}

export interface ICPStoryScript {
  id: string;
  name: string;
  demographics: string;
  coreBeliefs: ICPStoryScriptItem[];
  internalPains: ICPStoryScriptItem[];
  externalStruggles: ICPStoryScriptItem[];
  desiredTransformations: ICPStoryScriptItem[];
  clientId?: string;
}

export interface CustomerSuccessStory {
  id: string;
  title: string;
  url?: string;
  customerName?: string;
  problem?: string;
  solution?: string;
  results?: string;
  beforeSummary: string;
  afterSummary: string;
  quotes: {
    id: string;
    quote: string;
    author: string;
    title: string;
  }[];
  features: {
    id: string;
    name: string;
    description: string;
  }[];
  clientId?: string;
  productContextId?: string;
  createdAt: string;
}

export interface AnchoringElement {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
}

export interface StoryBrief {
  id: string;
  title: string;
  targetAudience: string;
  targetKeyword?: string;
  problemStatements?: string[];
  purposeStatement?: string;
  successStory?: string;
  callToAction?: string;
  outlineSteps?: string[];
  anchoringElements?: AnchoringElement[];
  clientId?: string;
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

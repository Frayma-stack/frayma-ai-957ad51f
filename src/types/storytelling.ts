
export interface CoreBelief {
  id: string;
  content: string;
}

export interface InternalPain {
  id: string;
  content: string;
}

export interface ExternalStruggle {
  id: string;
  content: string;
}

export interface DesiredTransformation {
  id: string;
  content: string;
}

export interface ICPStoryScriptItem {
  id: string;
  content: string;
}

export interface ICPStoryScript {
  id: string;
  name: string;
  clientId: string;
  demographics?: string;
  coreBeliefs: CoreBelief[];
  internalPains?: InternalPain[];
  externalStruggles?: ExternalStruggle[];
  desiredTransformations?: DesiredTransformation[];
}

export interface AuthorTone {
  id: string;
  tone: string;
}

export interface AuthorExperience {
  id: string;
  title: string;
  description?: string;
}

export interface AuthorBelief {
  id: string;
  belief: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  backstory: string;
  clientId?: string;
  role?: string;
  organization?: string;
  tones?: AuthorTone[];
  experiences?: AuthorExperience[];
  beliefs?: AuthorBelief[];
  socialLinks?: SocialLink[];
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
}

export interface ProductUseCase {
  id: string;
  useCase: string;
  description?: string;
}

export interface ProductDifferentiator {
  id: string;
  name: string;
  description: string;
}

export interface CustomerSuccessStory {
  id: string;
  clientId: string;
  title: string;
  authorId: string;
  icpScriptId: string;
  beforeSummary: string;
  afterSummary: string;
  productContextId: string;
  url?: string;
  quotes?: Array<{
    id: string;
    quote: string;
    author: string;
    title: string;
  }>;
  features?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  createdAt?: string;
}

export interface ProductContext {
  id: string;
  clientId: string;
  categoryPOV: string;
  companyMission: string;
  name?: string;
  description?: string;
  uniqueInsight?: string;
  features?: ProductFeature[];
  useCases?: ProductUseCase[];
  differentiators?: ProductDifferentiator[];
}

export interface Client {
  id: string;
  name: string;
  description: string;
}

export interface StoryBrief {
  id: string;
  title: string;
  description: string;
  clientId: string;
}

export interface MediaAttachment {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
}

export type ArticleSubType = 'thought_leadership' | 'newsletter';

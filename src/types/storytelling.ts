


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

export interface CompanyLink {
  id: string;
  type: 'website' | 'linkedin' | 'twitter' | 'facebook' | 'blog' | 'other';
  url: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  industry?: string;
  description?: string;
  productContextId?: string;
  companyLinks?: CompanyLink[];
  createdAt?: string;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  description: string;
  fileName?: string;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  media?: MediaAttachment[];
}

export interface ProductUseCase {
  id: string;
  useCase: string;
  userRole: string;
  description: string;
  media?: MediaAttachment[];
}

export interface ProductDifferentiator {
  id: string;
  name: string;
  description: string;
  competitorComparison?: string;
  media?: MediaAttachment[];
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
  companyLinks?: CompanyLink[];
  clientId?: string;
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
  useCases: {
    id: string;
    useCase: string;
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

export type ArticleSubType = 'thought_leadership' | 'newsletter';

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
  contentType?: ArticleSubType;
  goal?: string;
  relatedKeywords?: string[];
  searchQueries?: string[];
  businessObjectives?: string;
  journeyStage?: string;
  broaderAudience?: string;
  readingMotivation?: string;
}

export type NarrativeAnchorType = 'belief' | 'tone' | 'experience';

export interface NarrativeSelectionItem {
  id: string;
  content: string;
}

export interface NarrativeSelection {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  items: string[];
  anchorType: NarrativeAnchorType;
}



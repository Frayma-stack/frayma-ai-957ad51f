
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
  description?: string;
}

export interface AuthorExperience {
  id: string;
  title: string;
  description?: string;
}

export interface AuthorBelief {
  id: string;
  belief: string;
  description?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  type?: 'linkedin' | 'x' | 'blog' | 'website' | 'other';
}

// Legacy alias for backward compatibility
export type AuthorSocialLink = SocialLink;

export interface Author {
  id: string;
  name: string;
  title: string;
  backstory: string;
  clientId?: string;
  role?: string;
  organization?: string;
  bio?: string;
  company?: string;
  email?: string;
  tones?: AuthorTone[];
  experiences?: AuthorExperience[];
  beliefs?: AuthorBelief[];
  socialLinks?: SocialLink[];
}

export interface MediaAttachment {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
  description?: string;
  fileName?: string;
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  benefits?: string[];
  media?: MediaAttachment[];
}

export interface ProductUseCase {
  id: string;
  useCase: string;
  description?: string;
  userRole?: string;
  media?: MediaAttachment[];
}

export interface ProductDifferentiator {
  id: string;
  name: string;
  description: string;
  competitorComparison?: string;
  media?: MediaAttachment[];
}

export interface CustomerSuccessStory {
  id: string;
  clientId: string;
  authorId: string;
  icpScriptId: string;
  productContextId: string;
  title: string;
  beforeSummary: string;
  afterSummary: string;
  url?: string;
  quotes: Array<{
    id: string;
    quote: string;
    author: string;
    title: string;
  }>;
  features: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  useCases: Array<{
    id: string;
    useCase: string;
    description?: string;
  }>;
  createdAt?: string;
}

export interface CompanyLink {
  id: string;
  type: 'website' | 'linkedin' | 'blog' | 'other';
  url: string;
  description?: string;
}

export interface BusinessContext {
  id: string;
  clientId: string;
  categoryPOV: string;
  companyMission: string;
  uniqueInsight?: string;
  features?: ProductFeature[];
  useCases?: ProductUseCase[];
  differentiators?: ProductDifferentiator[];
  companyLinks?: CompanyLink[];
}

// Legacy alias for backward compatibility
export type ProductContext = BusinessContext;

export interface Account {
  id: string;
  name: string;
  description: string;
  companyLinks?: CompanyLink[];
  createdAt?: string;
}

// Legacy alias for backward compatibility
export type Client = Account;

export interface AnchoringElement {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
}

export interface StoryBrief {
  id: string;
  title: string;
  description: string;
  clientId: string;
  targetAudience?: string;
  targetKeyword?: string;
  problemStatements?: string[];
  outlineSteps?: string[];
  anchoringElements?: AnchoringElement[];
  successStory?: string;
  callToAction?: string;
  purposeStatement?: string;
  contentType?: ArticleSubType;
  goal?: string;
  relatedKeywords?: string[];
  searchQueries?: string[];
  businessObjectives?: string[];
  journeyStage?: string;
  broaderAudience?: string;
  readingMotivation?: string;
}

export type ArticleSubType = 'thought_leadership' | 'newsletter';

export interface NarrativeSelection {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
  items: string[];
}

// Legacy alias for backward compatibility
export type AuthorToneItem = AuthorTone;

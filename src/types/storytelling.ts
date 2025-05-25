
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
  clientId?: string; // Optional client ID to associate with a client
}

export interface CustomerSuccessStory {
  id: string;
  title: string;
  url?: string; // Optional URL if imported from web
  beforeSummary: string;
  afterSummary: string;
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
  clientId?: string; // Optional client ID to associate with a client
  createdAt: string;
}

export interface StoryBrief {
  id: string;
  title: string;
  contentType: 'thought_leadership' | 'newsletter'; // Updated to match ArticleSubType
  
  // Strategic Alignment
  goal: string;
  targetKeyword: string;
  purposeStatement: string;
  businessObjectives: string;
  callToAction: string;
  
  // Target Reader Resonance
  targetAudience: string; // References an ICPStoryScript
  journeyStage: string;
  broaderAudience: string;
  readingMotivation: string;
  anchoringElements: {
    type: 'belief' | 'pain' | 'struggle' | 'transformation';
    itemId: string;
  }[];
  successStory: string;
  
  // Content Discovery Triggers
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
  
  // Content Outline
  outlineSteps: string[];
  
  clientId?: string; // Optional client ID to associate with a client
}

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
  role: string;
  organization: string;
  backstory: string;
  experiences: AuthorExperience[];
  tones: AuthorToneItem[];
  beliefs: AuthorBelief[];
  socialLinks?: AuthorSocialLink[]; // Added new field for social links
  clientId?: string; // Optional client ID to associate with a client
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  description: string;
  fileName: string;
}

export interface ProductFeature {
  id: string;
  name: string;
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
  competitorComparison: string;
}

export interface CompanyLink {
  type: 'linkedin' | 'website' | 'about' | 'other';
  url: string;
}

export interface ProductContext {
  id: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
  companyLinks?: CompanyLink[]; // Added new field for company links
  clientId?: string; // Optional client ID to associate with a client
}

// Updated interface for client/company organization with company links
export interface Client {
  id: string;
  name: string;
  description?: string;
  companyLinks?: CompanyLink[]; // Added company links for analysis
  createdAt: string;
}

// New interface for narrative items selection
export interface NarrativeSelection {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  items: string[]; // Array of item IDs
}

// New interface for content generation options
export interface ContentGenerationOptions {
  wordCount?: number;
  emailCount?: number;
  successStoryId?: string;
  authorTone?: string;
  authorExperience?: string;
}

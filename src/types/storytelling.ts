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
}

export interface StoryBrief {
  id: string;
  title: string;
  
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

export interface Author {
  id: string;
  name: string;
  role: string;
  organization: string;
  backstory: string;
  experiences: AuthorExperience[];
  tones: AuthorToneItem[];
  beliefs: AuthorBelief[];
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

export interface ProductContext {
  id: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
}

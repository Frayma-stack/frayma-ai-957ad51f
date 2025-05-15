
export interface ICPStoryScript {
  id: string;
  name: string;
  demographics: string;
  coreBeliefs: string;
  internalPains: string;
  externalStruggles: string;
  desiredTransformations: string;
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
  anchoringElement: 'belief' | 'pain' | 'struggle' | 'transformation';
  anchoringElementDetail: string;
  successStory: string;
  
  // Content Discovery Triggers
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
  
  // Content Outline
  outlineSteps: string[];
}

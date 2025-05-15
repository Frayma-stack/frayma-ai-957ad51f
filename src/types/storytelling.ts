
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


import { useState } from 'react';

export interface NarrativeAnchor {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
}

export interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

export interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results';
}

export interface FormData {
  // Strategic Alignment
  ideaTrigger: string;
  selectedIdeaId: string; // New field for Ideas Bank selection
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
  strategicSuccessStory: string; // New field for success story selection
  
  // Target Reader Resonance
  mainTargetICP: string;
  journeyStage: 'TOFU' | 'MOFU' | 'BOFU' | '';
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: NarrativeAnchor[];
  successStory: string;
  
  // Content Discovery Triggers
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
  
  // Enhanced Content Outline
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  outlineSections: OutlineSection[];
  
  // Content Generation
  generatedIntro: string;
  generatedBody: string;
  generatedConclusion: string;
}

export const useGTMNarrativeData = () => {
  const [formData, setFormData] = useState<FormData>({
    ideaTrigger: '',
    selectedIdeaId: '',
    mutualGoal: '',
    targetKeyword: '',
    contentCluster: '',
    publishReason: '',
    callToAction: '',
    strategicSuccessStory: '',
    mainTargetICP: '',
    journeyStage: '',
    broaderAudience: '',
    readingPrompt: '',
    narrativeAnchors: [],
    successStory: '',
    relatedKeywords: [],
    searchQueries: [],
    problemStatements: [],
    headlineOptions: [],
    selectedHeadline: '',
    outlineSections: [],
    generatedIntro: '',
    generatedBody: '',
    generatedConclusion: ''
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedFromStep1 = () => {
    return formData.ideaTrigger && formData.mutualGoal && formData.targetKeyword && 
           formData.contentCluster && formData.publishReason && formData.callToAction;
  };

  const canProceedFromStep2 = () => {
    return formData.mainTargetICP && formData.journeyStage && formData.readingPrompt;
  };

  return {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2
  };
};

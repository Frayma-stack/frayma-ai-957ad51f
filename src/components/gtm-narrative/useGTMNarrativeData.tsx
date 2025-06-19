
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';

export interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results' | 'resonance' | 'relevance' | 'results';
  plsSteps: string;
}

export interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

export interface FormData {
  // Step 1: Strategic Alignment
  selectedIdeaId: string;
  ideaTrigger: string;
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
  strategicSuccessStory: string;

  // Step 2: Target Reader Resonance
  mainTargetICP: string;
  journeyStage: string;
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: string[];
  successStory: string;

  // Step 3: Content Discovery Triggers
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];

  // Step 4: Enhanced Content Outline
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  introPOV: string;
  outlineSections: OutlineSection[];

  // Generated Content
  generatedIntro: string;
  generatedBody: string;
  generatedConclusion: string;

  // Auto-crafting configuration
  autoCraftingConfig?: AutoCraftingConfig;
}

const initialFormData: FormData = {
  // Step 1
  selectedIdeaId: '',
  ideaTrigger: '',
  mutualGoal: '',
  targetKeyword: '',
  contentCluster: '',
  publishReason: '',
  callToAction: '',
  strategicSuccessStory: '',

  // Step 2
  mainTargetICP: '',
  journeyStage: '',
  broaderAudience: '',
  readingPrompt: '',
  narrativeAnchors: [],
  successStory: '',

  // Step 3
  relatedKeywords: [],
  searchQueries: [],
  problemStatements: [],

  // Step 4
  headlineOptions: [],
  selectedHeadline: '',
  introPOV: '',
  outlineSections: [],

  // Generated Content
  generatedIntro: '',
  generatedBody: '',
  generatedConclusion: ''
};

export const useGTMNarrativeData = () => {
  const [formData, setFormData] = useLocalStorage<FormData>('gtm-narrative-form', initialFormData);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedFromStep1 = (): boolean => {
    return Boolean(
      formData.ideaTrigger &&
      formData.mutualGoal &&
      formData.targetKeyword &&
      formData.callToAction
    );
  };

  const canProceedFromStep2 = (): boolean => {
    return Boolean(
      formData.mainTargetICP &&
      formData.journeyStage &&
      formData.readingPrompt
    );
  };

  return {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2
  };
};

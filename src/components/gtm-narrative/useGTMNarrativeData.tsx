
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
  phase: 'resonance' | 'relevance' | 'results';
  plsSteps: string;
}

export interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

export interface NarrativeAnchor {
  id: string;
  name: string;
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
}

export interface FormData {
  // Step 1: Strategic Alignment
  selectedIdeaId: string;
  ideaTrigger: string;
  mutualGoal: string;
  targetKeyword: string;
  businessContextItem: string;
  businessContextType: 'categoryPOV' | 'uniqueInsight' | 'companyMission' | 'feature' | 'useCase' | 'differentiator' | '';
  businessContextAssetId?: string; // For when feature/useCase/differentiator is selected
  publishReason: string;
  callToAction: string;
  strategicSuccessStory: string;

  // Step 2: Target Reader Resonance
  mainTargetICP: string;
  journeyStage: string;
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: NarrativeAnchor[];
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
  businessContextItem: '',
  businessContextType: '' as const,
  businessContextAssetId: '',
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
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedFromStep1 = (): boolean => {
    const baseFields = Boolean(
      formData.ideaTrigger &&
      formData.mutualGoal &&
      formData.targetKeyword &&
      formData.businessContextItem &&
      formData.businessContextType &&
      formData.callToAction
    );

    // If product-focused context is selected, also require businessContextAssetId
    const productFocusedTypes = ['feature', 'useCase', 'differentiator'];
    if (productFocusedTypes.includes(formData.businessContextType)) {
      return baseFields && Boolean(formData.businessContextAssetId);
    }

    return baseFields;
  };

  const canProceedFromStep2 = (): boolean => {
    return Boolean(
      formData.mainTargetICP &&
      formData.journeyStage &&
      formData.readingPrompt
    );
  };

  const canProceedFromStep3 = (): boolean => {
    return Boolean(
      formData.relatedKeywords?.length > 0 &&
      formData.searchQueries?.length > 0 &&
      formData.problemStatements?.length > 0
    );
  };

  return {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2,
    canProceedFromStep3
  };
};

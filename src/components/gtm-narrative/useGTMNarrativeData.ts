
import { useState } from 'react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummary } from '@/hooks/useIdeaSummary';

export interface FormData {
  ideaTrigger: string;
  selectedIdeaId: string;
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
  strategicSuccessStory: string;
  mainTargetICP: string;
  journeyStage: string;
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: string[];
  successStory: string;
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
  headlineOptions: string[];
  selectedHeadline: string;
  outlineSections: Array<{
    id: string;
    title: string;
    description: string;
    keyPoints: string[];
  }>;
  generatedIntro: string;
  generatedBody: string;
  generatedConclusion: string;
}

export const useGTMNarrativeData = () => {
  const { generateContentTrigger } = useIdeaSummary();
  
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enhanced handler for when an idea is selected
  const handleIdeaSelection = (idea: GeneratedIdea | null) => {
    if (idea) {
      const ideaTrigger = generateContentTrigger(idea);
      handleInputChange('selectedIdeaId', idea.id);
      handleInputChange('ideaTrigger', ideaTrigger);
      
      // Auto-populate other fields if the idea has them
      if (idea.cta) {
        handleInputChange('callToAction', idea.cta);
      }
    } else {
      handleInputChange('selectedIdeaId', '');
      handleInputChange('ideaTrigger', '');
    }
  };

  const canProceedFromStep1 = () => {
    return formData.ideaTrigger && formData.mutualGoal;
  };

  const canProceedFromStep2 = () => {
    return formData.mainTargetICP && formData.journeyStage;
  };

  return {
    formData,
    handleInputChange,
    handleIdeaSelection,
    canProceedFromStep1,
    canProceedFromStep2
  };
};

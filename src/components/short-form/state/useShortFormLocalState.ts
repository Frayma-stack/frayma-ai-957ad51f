
import { useState } from 'react';
import { NarrativeSelection } from '@/types/storytelling';
import { ContentGoal, ProductContextInputs } from './types';

interface UseShortFormLocalStateProps {
  persistedValues: any;
}

export const useShortFormLocalState = ({ persistedValues }: UseShortFormLocalStateProps) => {
  const [selectedICP, setSelectedICP] = useState<string>(persistedValues.selectedICP);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(persistedValues.selectedAuthor);
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>(persistedValues.selectedAuthorTone);
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>(persistedValues.selectedAuthorExperience);
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(
    persistedValues.contentGoal || { type: 'book_call', description: '' }
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [additionalContext, setAdditionalContext] = useState<string>(persistedValues.additionalContext);
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>(persistedValues.selectedSuccessStory);
  const [wordCount, setWordCount] = useState<number>(persistedValues.wordCount);
  const [emailCount, setEmailCount] = useState<number>(persistedValues.emailCount);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(persistedValues.selectedIdeaId);
  const [triggerInput, setTriggerInput] = useState<string>(persistedValues.triggerInput);

  // Product Context state
  const [productInputs, setProductInputs] = useState<ProductContextInputs>({
    selectedProductContextType: '',
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: []
  });

  return {
    selectedICP,
    setSelectedICP,
    selectedAuthor,
    setSelectedAuthor,
    selectedAuthorTone,
    setSelectedAuthorTone,
    selectedAuthorExperience,
    setSelectedAuthorExperience,
    narrativeSelections,
    setNarrativeSelections,
    contentGoal,
    setContentGoal,
    isGenerating,
    setIsGenerating,
    additionalContext,
    setAdditionalContext,
    selectedSuccessStory,
    setSelectedSuccessStory,
    wordCount,
    setWordCount,
    emailCount,
    setEmailCount,
    selectedIdeaId,
    setSelectedIdeaId,
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs
  };
};

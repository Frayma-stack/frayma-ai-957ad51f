
import { useState } from 'react';
import { ContentType, ContentGoal } from './types';
import { NarrativeSelection } from '@/types/storytelling';

interface UseShortFormStateProps {
  contentType: ContentType;
  selectedClientId?: string;
}

export const useShortFormState = ({ contentType, selectedClientId }: UseShortFormStateProps) => {
  // Core form state
  const [selectedICP, setSelectedICP] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>('');
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>('');
  const [selectedAuthorBelief, setSelectedAuthorBelief] = useState<string>('');
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  
  // Content options
  const [contentGoal, setContentGoal] = useState<ContentGoal>({
    type: 'book_call',
    description: 'Build awareness and thought leadership'
  });
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(150);
  const [emailCount, setEmailCount] = useState<number>(3);
  const [additionalContext, setAdditionalContext] = useState<string>('');
  
  // Trigger and ideas
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [triggerInput, setTriggerInput] = useState<string>('');
  
  // Product inputs
  const [productInputs, setProductInputs] = useState({
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: [],
    customPOV: ''
  });
  
  // Generation state
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  return {
    // Core form state
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
    narrativeSelections,
    
    // Content options
    contentGoal,
    selectedSuccessStory,
    wordCount,
    emailCount,
    additionalContext,
    
    // Trigger and ideas
    selectedIdeaId,
    triggerInput,
    productInputs,
    
    // Generation state
    generatedContent,
    isGenerating,
    
    // Setters
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setAdditionalContext,
    setSelectedIdeaId,
    setTriggerInput,
    setProductInputs,
    setGeneratedContent,
    setIsGenerating
  };
};

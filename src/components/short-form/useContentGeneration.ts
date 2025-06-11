
import { useCallback } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useContentDataAccess } from './useContentDataAccess';
import { useNarrativeContent } from './useNarrativeContent';
import { useShortFormContentGeneration } from './useShortFormContentGeneration';

interface UseContentGenerationProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  narrativeSelections: NarrativeSelection[];
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedSuccessStory: string;
  contentGoal: ContentGoal;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
  isFormValid: () => boolean;
  getSelectedIdea: () => GeneratedIdea | null;
}

export const useContentGeneration = ({
  contentType,
  scripts,
  authors,
  successStories,
  narrativeSelections,
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedSuccessStory,
  contentGoal,
  wordCount,
  emailCount,
  additionalContext,
  triggerInput,
  setIsGenerating,
  setGeneratedContent,
  isFormValid,
  getSelectedIdea
}: UseContentGenerationProps) => {
  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory
  } = useContentDataAccess({
    scripts,
    authors,
    successStories,
    narrativeSelections,
    selectedICP,
    selectedAuthor,
    selectedSuccessStory
  });

  const { getSelectedNarrativeContents } = useNarrativeContent({
    narrativeSelections,
    selectedICP,
    scripts
  });

  const { generateContent: performGeneration } = useShortFormContentGeneration({
    contentType,
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedSuccessStory,
    contentGoal,
    wordCount,
    emailCount,
    additionalContext,
    triggerInput,
    scripts,
    authors,
    successStories,
    narrativeSelections,
    setIsGenerating,
    setGeneratedContent,
    isFormValid,
    getSelectedIdea
  });

  const generateContent = useCallback(async () => {
    return await performGeneration();
  }, [performGeneration]);

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getSelectedNarrativeContents,
    generateContent
  };
};

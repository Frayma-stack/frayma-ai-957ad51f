
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useContentDataAccess } from './useContentDataAccess';
import { useNarrativeContent } from './useNarrativeContent';
import { useEmailContentGenerator } from './generators/useEmailContentGenerator';
import { useLinkedInContentGenerator } from './generators/useLinkedInContentGenerator';
import { useCustomContentGenerator } from './generators/useCustomContentGenerator';

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
  triggerInput
}: UseContentGenerationProps) => {
  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getAuthorTones,
    getAuthorExperiences
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

  const { generateEmailContent } = useEmailContentGenerator({
    selectedAuthorTone,
    selectedAuthorExperience,
    additionalContext,
    emailCount,
    contentGoal,
    triggerInput,
    getAuthorTones,
    getAuthorExperiences,
    getSelectedNarrativeContents
  });

  const { generateLinkedInContent } = useLinkedInContentGenerator({
    selectedAuthorTone,
    selectedAuthorExperience,
    additionalContext,
    contentGoal,
    triggerInput,
    getAuthorTones,
    getAuthorExperiences,
    getSelectedNarrativeContents
  });

  const { generateCustomContent } = useCustomContentGenerator({
    selectedAuthorTone,
    selectedAuthorExperience,
    additionalContext,
    contentGoal,
    triggerInput,
    getAuthorTones,
    getAuthorExperiences,
    getSelectedNarrativeContents
  });

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getAuthorTones,
    getAuthorExperiences,
    getSelectedNarrativeContents,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
  };
};

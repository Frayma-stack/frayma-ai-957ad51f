
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useContentDataAccess } from './useContentDataAccess';
import { useNarrativeContent } from './useNarrativeContent';

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
  selectedSuccessStory
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

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getSelectedNarrativeContents
  };
};

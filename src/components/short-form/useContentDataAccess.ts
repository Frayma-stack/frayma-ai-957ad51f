
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';

interface UseContentDataAccessProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  narrativeSelections: NarrativeSelection[];
  selectedICP: string;
  selectedAuthor: string;
  selectedSuccessStory: string;
}

export const useContentDataAccess = ({
  scripts,
  authors,
  successStories,
  selectedICP,
  selectedAuthor,
  selectedSuccessStory
}: UseContentDataAccessProps) => {
  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  const getSelectedSuccessStory = () => {
    if (selectedSuccessStory === 'none' || !selectedSuccessStory) return undefined;
    return successStories.find(story => story.id === selectedSuccessStory);
  };

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory
  };
};

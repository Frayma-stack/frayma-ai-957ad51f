
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
    if (selectedSuccessStory === "none") return undefined;
    return successStories.find(story => story.id === selectedSuccessStory);
  };

  const getAuthorTones = () => {
    const author = getSelectedAuthor();
    return author?.tones || [];
  };

  const getAuthorExperiences = () => {
    const author = getSelectedAuthor();
    return author?.experiences || [];
  };

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getAuthorTones,
    getAuthorExperiences
  };
};

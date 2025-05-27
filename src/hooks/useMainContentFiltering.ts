
import { useMemo } from 'react';
import { Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';

interface UseMainContentFilteringProps {
  selectedClientId: string | null;
  authors: Author[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
}

export const useMainContentFiltering = ({
  selectedClientId,
  authors,
  icpScripts,
  successStories,
  productContexts,
}: UseMainContentFilteringProps) => {
  const filteredAuthors = useMemo(() => {
    return selectedClientId 
      ? authors.filter(author => author.clientId === selectedClientId)
      : authors;
  }, [selectedClientId, authors]);

  const filteredICPScripts = useMemo(() => {
    return selectedClientId 
      ? icpScripts.filter(script => script.clientId === selectedClientId)
      : icpScripts;
  }, [selectedClientId, icpScripts]);

  const filteredSuccessStories = useMemo(() => {
    return selectedClientId 
      ? successStories.filter(story => story.clientId === selectedClientId)
      : successStories;
  }, [selectedClientId, successStories]);

  const currentProductContext = useMemo(() => {
    return selectedClientId 
      ? productContexts.find(context => context.clientId === selectedClientId) || null
      : null;
  }, [selectedClientId, productContexts]);

  return {
    filteredAuthors,
    filteredICPScripts,
    filteredSuccessStories,
    currentProductContext,
  };
};

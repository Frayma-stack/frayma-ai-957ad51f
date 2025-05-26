
import { Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';

interface UseContentFilteringProps {
  selectedClientId: string | null;
  authors: Author[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
}

export const useContentFiltering = ({
  selectedClientId,
  authors,
  icpScripts,
  successStories,
  productContexts,
}: UseContentFilteringProps) => {
  const getFilteredAuthors = () => {
    if (selectedClientId) {
      return authors.filter(author => author.clientId === selectedClientId);
    }
    return authors;
  };

  const getFilteredICPScripts = () => {
    if (selectedClientId) {
      return icpScripts.filter(script => script.clientId === selectedClientId);
    }
    return icpScripts;
  };

  const getFilteredSuccessStories = () => {
    if (selectedClientId) {
      return successStories.filter(story => story.clientId === selectedClientId);
    }
    return successStories;
  };

  const getFilteredProductContexts = () => {
    if (selectedClientId) {
      return productContexts.filter(context => context.clientId === selectedClientId);
    }
    return productContexts;
  };

  const getCurrentProductContext = () => {
    const filtered = getFilteredProductContexts();
    return filtered.length > 0 ? filtered[0] : null;
  };

  return {
    getFilteredAuthors,
    getFilteredICPScripts,
    getFilteredSuccessStories,
    getFilteredProductContexts,
    getCurrentProductContext,
  };
};

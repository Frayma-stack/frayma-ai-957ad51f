
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
    console.log('🔍 getFilteredAuthors called with:', {
      selectedClientId,
      totalAuthors: authors.length,
      authorsDetailed: authors.map(author => ({
        id: author.id,
        name: author.name,
        clientId: author.clientId,
        hasClientId: !!author.clientId,
        clientIdType: typeof author.clientId,
        matchesSelected: author.clientId === selectedClientId,
        isNull: author.clientId === null,
        isUndefined: author.clientId === undefined
      }))
    });

    if (selectedClientId) {
      // Only show authors that explicitly belong to the selected client
      const filtered = authors.filter(author => author.clientId === selectedClientId);
      
      console.log('🔍 Filtered authors result (strict client matching):', {
        selectedClientId,
        filteredCount: filtered.length,
        filteredAuthors: filtered.map(a => ({
          id: a.id,
          name: a.name,
          clientId: a.clientId
        }))
      });
      
      return filtered;
    }
    
    // If no client is selected, show all authors
    console.log('🔍 No client selected, returning all authors:', authors.length);
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

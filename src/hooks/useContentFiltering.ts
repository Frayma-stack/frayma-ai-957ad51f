
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
      // Show authors that belong to the selected client OR have no clientId (available to all)
      const filtered = authors.filter(author => 
        author.clientId === selectedClientId || author.clientId === null || author.clientId === undefined
      );
      
      console.log('🔍 Filtered authors result:', {
        selectedClientId,
        filteredCount: filtered.length,
        filteredAuthors: filtered.map(a => ({
          id: a.id,
          name: a.name,
          clientId: a.clientId,
          reason: a.clientId === selectedClientId ? 'matches_client' : 'no_client_id'
        }))
      });
      
      return filtered;
    }
    
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


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
    console.log('🔍 getFilteredAuthors - Client-specific filtering:', {
      selectedClientId,
      selectedClientIdType: typeof selectedClientId,
      totalAuthors: authors.length,
      authorsDetailed: authors.map(author => ({
        id: author.id,
        name: author.name,
        role: author.role,
        organization: author.organization,
        clientId: author.clientId,
        clientIdType: typeof author.clientId,
        belongsToSelectedClient: author.clientId === selectedClientId,
        hasValidId: !!author.id && author.id.trim() !== '',
        hasValidName: !!author.name && author.name.trim() !== ''
      }))
    });

    // If no client is selected, show all valid authors
    if (!selectedClientId) {
      const validAuthors = authors.filter(author => 
        author && 
        author.id && 
        author.id.trim() !== '' && 
        author.name && 
        author.name.trim() !== ''
      );
      
      console.log('🔍 No client selected, returning all valid authors:', {
        totalAuthors: authors.length,
        validAuthors: validAuthors.length,
        validAuthorsList: validAuthors.map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
      });
      
      return validAuthors;
    }

    // When a client is selected, ONLY show authors that explicitly belong to that client
    const filtered = authors.filter(author => {
      const isValid = author && 
        author.id && 
        author.id.trim() !== '' && 
        author.name && 
        author.name.trim() !== '';
      
      const belongsToClient = author.clientId === selectedClientId;
      
      const shouldInclude = isValid && belongsToClient;
      
      console.log('🔍 Author filtering decision (client-specific only):', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        isValid,
        belongsToClient,
        shouldInclude
      });
      
      return shouldInclude;
    });
    
    console.log('🔍 Filtered authors result (client-specific only):', {
      selectedClientId,
      filteredCount: filtered.length,
      filteredAuthors: filtered.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        clientId: a.clientId
      }))
    });
    
    return filtered;
  };

  const getFilteredICPScripts = () => {
    if (!selectedClientId) {
      return icpScripts;
    }
    // Only show ICP scripts that belong to the selected client
    return icpScripts.filter(script => script.clientId === selectedClientId);
  };

  const getFilteredSuccessStories = () => {
    if (!selectedClientId) {
      return successStories;
    }
    // Only show success stories that belong to the selected client
    return successStories.filter(story => story.clientId === selectedClientId);
  };

  const getFilteredProductContexts = () => {
    if (!selectedClientId) {
      return productContexts;
    }
    // Only show product contexts that belong to the selected client
    return productContexts.filter(context => context.clientId === selectedClientId);
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


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
    console.log('🔍 getFilteredAuthors COMPREHENSIVE DEBUG:', {
      selectedClientId,
      selectedClientIdType: typeof selectedClientId,
      totalAuthors: authors.length,
      authorsRaw: authors,
      authorsDetailed: authors.map(author => ({
        id: author.id,
        name: author.name,
        role: author.role,
        organization: author.organization,
        clientId: author.clientId,
        clientIdType: typeof author.clientId,
        hasClientId: !!author.clientId,
        clientIdString: String(author.clientId),
        selectedClientIdString: String(selectedClientId),
        exactMatch: author.clientId === selectedClientId,
        stringMatch: String(author.clientId) === String(selectedClientId),
        isNull: author.clientId === null,
        isUndefined: author.clientId === undefined,
        isEmpty: author.clientId === '',
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

    // Filter authors for the selected client
    // Include authors that belong to the client OR have no client assigned (global authors)
    const filtered = authors.filter(author => {
      const isValid = author && 
        author.id && 
        author.id.trim() !== '' && 
        author.name && 
        author.name.trim() !== '';
      
      const belongsToClient = author.clientId === selectedClientId;
      const isGlobalAuthor = !author.clientId || author.clientId === null || author.clientId === undefined || author.clientId === '';
      
      const shouldInclude = isValid && (belongsToClient || isGlobalAuthor);
      
      console.log('🔍 Author filtering decision:', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        isValid,
        belongsToClient,
        isGlobalAuthor,
        shouldInclude
      });
      
      return shouldInclude;
    });
    
    console.log('🔍 Filtered authors result (with global authors):', {
      selectedClientId,
      filteredCount: filtered.length,
      filteredAuthors: filtered.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        clientId: a.clientId,
        reason: a.clientId === selectedClientId ? 'belongs_to_client' : 'global_author'
      }))
    });
    
    return filtered;
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

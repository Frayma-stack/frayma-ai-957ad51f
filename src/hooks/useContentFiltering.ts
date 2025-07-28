
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
    console.log('🔍 getFilteredAuthors - Account-specific + unassigned filtering:', {
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
        belongsToSelectedAccount: author.clientId === selectedClientId,
        isUnassigned: !author.clientId,
        hasValidId: !!author.id && author.id.trim() !== '',
        hasValidName: !!author.name && author.name.trim() !== ''
      }))
    });

    // If no account is selected, show all valid authors
    if (!selectedClientId) {
      const validAuthors = authors.filter(author => 
        author && 
        author.id && 
        author.id.trim() !== '' && 
        author.name && 
        author.name.trim() !== ''
      );
      
      console.log('🔍 No account selected, returning all valid authors:', {
        totalAuthors: authors.length,
        validAuthors: validAuthors.length,
        validAuthorsList: validAuthors.map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
      });
      
      return validAuthors;
    }

    // When an account is selected, show authors that belong to that account OR are unassigned
    const filtered = authors.filter(author => {
      const isValid = author && 
        author.id && 
        author.id.trim() !== '' && 
        author.name && 
        author.name.trim() !== '';
      
      const belongsToAccount = author.clientId === selectedClientId;
      const isUnassigned = !author.clientId;
      
      const shouldInclude = isValid && (belongsToAccount || isUnassigned);
      
      console.log('🔍 Author filtering decision (account + unassigned):', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        isValid,
        belongsToAccount,
        isUnassigned,
        shouldInclude
      });
      
      return shouldInclude;
    });
    
    console.log('🔍 Filtered authors result (account + unassigned):', {
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

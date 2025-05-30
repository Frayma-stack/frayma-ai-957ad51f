
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
    console.log('🔒 useMainContentFiltering - Applying strict client-only filtering for authors:', {
      selectedClientId,
      totalAuthors: authors.length,
      clientSpecific: !!selectedClientId,
      authorsDetailed: authors.map(a => ({
        id: a.id,
        name: a.name,
        clientId: a.clientId,
        organization: a.organization
      }))
    });

    // Strict client-first approach: only show authors that explicitly belong to the selected client
    if (selectedClientId) {
      const filtered = authors.filter(author => author.clientId === selectedClientId);
      
      console.log('🔒 Client-specific authors only (strict filtering):', {
        filteredCount: filtered.length,
        filtered: filtered.map(a => ({
          id: a.id,
          name: a.name,
          clientId: a.clientId
        }))
      });

      return filtered;
    }
    
    // When no client is selected, return empty array (client-first approach)
    console.log('🔒 No client selected - returning empty authors array (client-first approach)');
    return [];
  }, [selectedClientId, authors]);

  const filteredICPScripts = useMemo(() => {
    console.log('🔒 useMainContentFiltering - Applying strict client filtering for ICP scripts:', {
      selectedClientId,
      totalScripts: icpScripts.length
    });

    if (selectedClientId) {
      const filtered = icpScripts.filter(script => script.clientId === selectedClientId);
      console.log('🔒 Client-specific ICP scripts only:', filtered.length);
      return filtered;
    }
    
    return icpScripts;
  }, [selectedClientId, icpScripts]);

  const filteredSuccessStories = useMemo(() => {
    console.log('🔒 useMainContentFiltering - Applying strict client filtering for success stories:', {
      selectedClientId,
      totalStories: successStories.length
    });

    if (selectedClientId) {
      const filtered = successStories.filter(story => story.clientId === selectedClientId);
      console.log('🔒 Client-specific success stories only:', filtered.length);
      return filtered;
    }
    
    return successStories;
  }, [selectedClientId, successStories]);

  const currentProductContext = useMemo(() => {
    console.log('🔒 useMainContentFiltering - Finding product context for client:', {
      selectedClientId,
      totalContexts: productContexts.length
    });

    if (selectedClientId) {
      const context = productContexts.find(context => context.clientId === selectedClientId) || null;
      console.log('🔒 Found product context:', !!context);
      return context;
    }
    
    return null;
  }, [selectedClientId, productContexts]);

  return {
    filteredAuthors,
    filteredICPScripts,
    filteredSuccessStories,
    currentProductContext,
  };
};

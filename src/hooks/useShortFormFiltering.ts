
import { useMemo } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface UseShortFormFilteringProps {
  selectedClientId?: string | null;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
}

export const useShortFormFiltering = ({
  selectedClientId,
  scripts,
  authors,
  successStories,
  ideas
}: UseShortFormFilteringProps) => {
  console.log('🔍 useShortFormFiltering - Account + unassigned asset filtering:', {
    selectedClientId,
    originalAuthorsCount: authors.length,
    originalScriptsCount: scripts.length,
    originalSuccessStoriesCount: successStories.length,
    originalIdeasCount: ideas.length,
    authorsDetailed: authors.map(a => ({
      id: a.id,
      name: a.name,
      clientId: a.clientId,
      belongsToSelectedAccount: a.clientId === selectedClientId,
      isUnassigned: !a.clientId
    }))
  });

  const filteredAuthors = useMemo(() => {
    if (!selectedClientId) {
      console.log('🔍 No account selected, returning empty authors array (account-first approach)');
      return [];
    }
    
    console.log('🔍 Filtering authors for account (includes unassigned):', selectedClientId);
    console.log('🔍 Available authors before filtering:', authors.map(a => ({
      id: a.id,
      name: a.name,
      clientId: a.clientId,
      organization: a.organization
    })));
    
    // Allow authors that belong to the selected account OR have no account assignment (clientId: null)
    const filtered = authors.filter(author => {
      const belongsToAccount = author.clientId === selectedClientId;
      const isUnassigned = !author.clientId;
      const shouldInclude = belongsToAccount || isUnassigned;
      
      console.log('🔍 Author filter check (account + unassigned):', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        belongsToAccount,
        isUnassigned,
        willInclude: shouldInclude
      });
      
      return shouldInclude;
    });
    
    console.log('🔍 Authors after account + unassigned filtering:', {
      originalCount: authors.length,
      filteredCount: filtered.length,
      filtered: filtered.map(a => ({ 
        id: a.id, 
        name: a.name, 
        clientId: a.clientId
      }))
    });

    return filtered;
  }, [selectedClientId, authors]);

  const filteredScripts = useMemo(() => {
    return selectedClientId 
      ? scripts.filter(script => script.clientId === selectedClientId)
      : scripts;
  }, [selectedClientId, scripts]);

  const filteredSuccessStories = useMemo(() => {
    return selectedClientId 
      ? successStories.filter(story => story.clientId === selectedClientId)
      : successStories;
  }, [selectedClientId, successStories]);

  const filteredIdeas = useMemo(() => {
    return selectedClientId 
      ? ideas.filter(idea => idea.clientId === selectedClientId)
      : ideas;
  }, [selectedClientId, ideas]);

  console.log('🔍 useShortFormFiltering - After account + unassigned filtering:', {
    filteredAuthorsCount: filteredAuthors.length,
    filteredScriptsCount: filteredScripts.length,
    filteredSuccessStoriesCount: filteredSuccessStories.length,
    filteredIdeasCount: filteredIdeas.length,
    restrictionApplied: !!selectedClientId
  });

  return {
    filteredAuthors,
    filteredScripts,
    filteredSuccessStories,
    filteredIdeas
  };
};

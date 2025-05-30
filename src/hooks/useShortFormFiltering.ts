
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
  console.log('🔍 useShortFormFiltering - Client-specific asset filtering:', {
    selectedClientId,
    originalAuthorsCount: authors.length,
    originalScriptsCount: scripts.length,
    originalSuccessStoriesCount: successStories.length,
    originalIdeasCount: ideas.length,
    authorsDetailed: authors.map(a => ({
      id: a.id,
      name: a.name,
      clientId: a.clientId,
      belongsToSelectedClient: a.clientId === selectedClientId
    }))
  });

  const filteredAuthors = useMemo(() => {
    if (!selectedClientId) {
      console.log('🔍 No client selected, returning all authors');
      return authors;
    }
    
    console.log('🔍 Filtering authors for client:', selectedClientId);
    console.log('🔍 Available authors before filtering:', authors.map(a => ({
      id: a.id,
      name: a.name,
      clientId: a.clientId,
      organization: a.organization
    })));
    
    // Modified filtering logic: include authors that belong to the client OR have no client assignment (null)
    const filtered = authors.filter(author => {
      const belongsToClient = author.clientId === selectedClientId;
      const isUnassigned = author.clientId === null;
      const shouldInclude = belongsToClient || isUnassigned;
      
      console.log('🔍 Author filter check:', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        belongsToClient,
        isUnassigned,
        shouldInclude
      });
      
      return shouldInclude;
    });
    
    console.log('🔍 Authors after filtering:', {
      originalCount: authors.length,
      filteredCount: filtered.length,
      filtered: filtered.map(a => ({ 
        id: a.id, 
        name: a.name, 
        clientId: a.clientId,
        reason: a.clientId === selectedClientId ? 'client_specific' : 'unassigned_available_for_all'
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

  console.log('🔍 useShortFormFiltering - After client filtering:', {
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


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
    
    const filtered = authors.filter(author => {
      const belongs = author.clientId === selectedClientId;
      console.log('🔍 Author filter check:', {
        authorId: author.id,
        authorName: author.name,
        authorClientId: author.clientId,
        selectedClientId,
        belongs
      });
      return belongs;
    });
    
    console.log('🔍 Authors after filtering:', {
      originalCount: authors.length,
      filteredCount: filtered.length,
      filtered: filtered.map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
    });

    // If no authors found for the selected client, let's check if there are any authors with null clientId
    if (filtered.length === 0) {
      const authorsWithNullClient = authors.filter(a => a.clientId === null);
      console.log('⚠️ No authors found for selected client. Authors with null clientId:', authorsWithNullClient.map(a => ({
        id: a.id,
        name: a.name,
        organization: a.organization
      })));
    }
    
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

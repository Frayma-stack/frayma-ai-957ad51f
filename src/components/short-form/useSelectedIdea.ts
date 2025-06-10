
import { useCallback } from 'react';
import { GeneratedIdea } from '@/types/ideas';

interface UseSelectedIdeaProps {
  selectedIdeaId: string | null;
  ideas: GeneratedIdea[];
}

export const useSelectedIdea = ({ selectedIdeaId, ideas }: UseSelectedIdeaProps) => {
  const getSelectedIdea = useCallback(() => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  }, [selectedIdeaId, ideas]);

  return { getSelectedIdea };
};

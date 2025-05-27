
import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { GeneratedIdea } from '@/types/ideas';
import { toast } from 'sonner';

export const useIdeaData = () => {
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);

  const loadIdeas = async () => {
    const data = await supabaseDataService.getIdeas();
    setIdeas(data);
    return data;
  };

  const handleIdeaAdded = async (idea: GeneratedIdea) => {
    try {
      const newIdea = await supabaseDataService.createIdea(idea);
      setIdeas(prev => [newIdea, ...prev]);
      toast.success('Idea saved successfully');
      return newIdea;
    } catch (error) {
      console.error('Error creating idea:', error);
      toast.error('Failed to save idea');
      throw error;
    }
  };

  const handleIdeaUpdated = async (updatedIdea: GeneratedIdea) => {
    try {
      const idea = await supabaseDataService.updateIdea(updatedIdea);
      setIdeas(prev => prev.map(i => i.id === idea.id ? idea : i));
      toast.success('Idea updated successfully');
      return idea;
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
      throw error;
    }
  };

  const handleIdeaDeleted = async (ideaId: string) => {
    try {
      await supabaseDataService.deleteIdea(ideaId);
      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast.success('Idea deleted successfully');
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
      throw error;
    }
  };

  return {
    ideas,
    setIdeas,
    loadIdeas,
    handleIdeaAdded,
    handleIdeaUpdated,
    handleIdeaDeleted,
  };
};

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
      console.log('💡 Creating idea with client assignment:', {
        title: idea.title,
        clientId: idea.clientId,
        clientAssignment: idea.clientId ? 'client_specific' : 'no_client'
      });

      const newIdea = await supabaseDataService.createIdea(idea);
      
      console.log('💡 Idea created successfully:', {
        id: newIdea.id,
        title: newIdea.title,
        clientId: newIdea.clientId,
        clientAssignment: newIdea.clientId ? 'client_specific' : 'no_client'
      });

      setIdeas(prev => [newIdea, ...prev]);
      toast.success(`Idea saved successfully${newIdea.clientId ? ' for selected client' : ''}`);
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

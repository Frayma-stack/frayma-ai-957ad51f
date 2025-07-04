import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { CustomerSuccessStory } from '@/types/storytelling';
import { toast } from 'sonner';

export const useSuccessStoryData = () => {
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);

  const loadSuccessStories = async () => {
    const data = await supabaseDataService.getSuccessStories();
    setSuccessStories(data);
    return data;
  };

  const handleSuccessStoryAdded = async (story: CustomerSuccessStory) => {
    try {
      console.log('📖 Creating success story with client assignment:', {
        title: story.title,
        clientId: story.clientId,
        clientAssignment: story.clientId ? 'client_specific' : 'no_client'
      });

      const newStory = await supabaseDataService.createSuccessStory(story);
      
      console.log('📖 Success story created successfully:', {
        id: newStory.id,
        title: newStory.title,
        clientId: newStory.clientId,
        clientAssignment: newStory.clientId ? 'client_specific' : 'no_client'
      });

      setSuccessStories(prev => [newStory, ...prev]);
      toast.success(`Success story created successfully${newStory.clientId ? ' for selected client' : ''}`);
      return newStory;
    } catch (error) {
      console.error('Error creating success story:', error);
      toast.error('Failed to create success story');
      throw error;
    }
  };

  const handleSuccessStoryUpdated = async (updatedStory: CustomerSuccessStory) => {
    try {
      const story = await supabaseDataService.updateSuccessStory(updatedStory);
      setSuccessStories(prev => prev.map(s => s.id === story.id ? story : s));
      toast.success('Success story updated successfully');
      return story;
    } catch (error) {
      console.error('Error updating success story:', error);
      toast.error('Failed to update success story');
      throw error;
    }
  };

  const handleSuccessStoryDeleted = async (storyId: string) => {
    try {
      await supabaseDataService.deleteSuccessStory(storyId);
      setSuccessStories(prev => prev.filter(story => story.id !== storyId));
      toast.success('Success story deleted successfully');
    } catch (error) {
      console.error('Error deleting success story:', error);
      toast.error('Failed to delete success story');
      throw error;
    }
  };

  return {
    successStories,
    setSuccessStories,
    loadSuccessStories,
    handleSuccessStoryAdded,
    handleSuccessStoryUpdated,
    handleSuccessStoryDeleted,
  };
};

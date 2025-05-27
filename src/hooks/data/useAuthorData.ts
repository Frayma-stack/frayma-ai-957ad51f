
import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';

export const useAuthorData = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const loadAuthors = async () => {
    const data = await supabaseDataService.getAuthors();
    setAuthors(data);
    return data;
  };

  const handleAuthorAdded = async (author: Author) => {
    try {
      const newAuthor = await supabaseDataService.createAuthor(author);
      setAuthors(prev => [newAuthor, ...prev]);
      toast.success('Author created successfully');
      return newAuthor;
    } catch (error) {
      console.error('Error creating author:', error);
      toast.error('Failed to create author');
      throw error;
    }
  };

  const handleAuthorUpdated = async (updatedAuthor: Author) => {
    try {
      const author = await supabaseDataService.updateAuthor(updatedAuthor);
      setAuthors(prev => prev.map(a => a.id === author.id ? author : a));
      toast.success('Author updated successfully');
      return author;
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Failed to update author');
      throw error;
    }
  };

  const handleAuthorDeleted = async (authorId: string) => {
    try {
      await supabaseDataService.deleteAuthor(authorId);
      setAuthors(prev => prev.filter(author => author.id !== authorId));
      toast.success('Author deleted successfully');
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Failed to delete author');
      throw error;
    }
  };

  return {
    authors,
    setAuthors,
    loadAuthors,
    handleAuthorAdded,
    handleAuthorUpdated,
    handleAuthorDeleted,
  };
};

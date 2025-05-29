
import { useState } from 'react';
import { authorService } from '@/services/AuthorService';
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';

export const useAuthorData = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const loadAuthors = async () => {
    try {
      console.log('📚 useAuthorData.loadAuthors called');
      const data = await authorService.getAuthors();
      console.log('📚 Authors loaded successfully:', data?.length || 0);
      setAuthors(data);
      return data;
    } catch (error) {
      console.error('📚 Error loading authors:', error);
      toast.error('Failed to load authors');
      throw error;
    }
  };

  const handleAuthorAdded = async (author: Author) => {
    try {
      console.log('📚 useAuthorData.handleAuthorAdded called with:', {
        name: author.name,
        id: author.id,
        role: author.role,
        organization: author.organization
      });
      
      console.log('📚 Calling authorService.createAuthor...');
      const newAuthor = await authorService.createAuthor(author);
      console.log('📚 authorService.createAuthor completed, result:', {
        id: newAuthor.id,
        name: newAuthor.name
      });
      
      console.log('📚 Updating local authors state...');
      setAuthors(prev => {
        const updated = [newAuthor, ...prev];
        console.log('📚 Authors state updated, new count:', updated.length);
        return updated;
      });
      
      console.log('📚 Showing success toast...');
      toast.success('Author created successfully');
      
      console.log('📚 handleAuthorAdded completed successfully');
      return newAuthor;
    } catch (error) {
      console.error('📚 Error in handleAuthorAdded:', error);
      console.error('📚 Error stack:', error instanceof Error ? error.stack : 'No stack');
      toast.error('Failed to create author');
      throw error;
    }
  };

  const handleAuthorUpdated = async (updatedAuthor: Author) => {
    try {
      console.log('📚 useAuthorData.handleAuthorUpdated called with:', {
        id: updatedAuthor.id,
        name: updatedAuthor.name
      });
      
      const author = await authorService.updateAuthor(updatedAuthor);
      console.log('📚 Author updated successfully:', author.id);
      
      setAuthors(prev => prev.map(a => a.id === author.id ? author : a));
      toast.success('Author updated successfully');
      return author;
    } catch (error) {
      console.error('📚 Error updating author:', error);
      toast.error('Failed to update author');
      throw error;
    }
  };

  const handleAuthorDeleted = async (authorId: string) => {
    try {
      console.log('📚 Deleting author:', authorId);
      await authorService.deleteAuthor(authorId);
      setAuthors(prev => prev.filter(author => author.id !== authorId));
      toast.success('Author deleted successfully');
    } catch (error) {
      console.error('📚 Error deleting author:', error);
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

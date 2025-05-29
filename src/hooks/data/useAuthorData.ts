
import { useState } from 'react';
import { authorService } from '@/services/AuthorService';
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';

export const useAuthorData = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const loadAuthors = async () => {
    try {
      console.log('Loading authors...');
      const data = await authorService.getAuthors();
      console.log('Authors loaded:', data);
      setAuthors(data);
      return data;
    } catch (error) {
      console.error('Error loading authors:', error);
      toast.error('Failed to load authors');
      throw error;
    }
  };

  const handleAuthorAdded = async (author: Author) => {
    try {
      console.log('Adding author:', author);
      const newAuthor = await authorService.createAuthor(author);
      console.log('Author added successfully:', newAuthor);
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
      console.log('Updating author:', updatedAuthor);
      const author = await authorService.updateAuthor(updatedAuthor);
      console.log('Author updated successfully:', author);
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
      console.log('Deleting author:', authorId);
      await authorService.deleteAuthor(authorId);
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

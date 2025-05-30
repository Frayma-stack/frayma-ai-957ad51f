
import { useState } from 'react';
import { Author, Client } from '@/types/storytelling';
import { useToast } from '@/components/ui/use-toast';

interface UseAuthorManagerProps {
  authors: Author[];
  onAuthorAdded: (author: Author) => Promise<Author>;
  onAuthorUpdated: (author: Author) => Promise<Author>;
  onAuthorDeleted: (authorId: string) => Promise<void>;
}

export const useAuthorManager = ({
  authors,
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted
}: UseAuthorManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const { toast } = useToast();

  console.log('🚀 useAuthorManager initialized with:', {
    authorsCount: authors.length,
    onAuthorAddedType: typeof onAuthorAdded,
    onAuthorUpdatedType: typeof onAuthorUpdated,
    isAddedAsync: onAuthorAdded.constructor.name === 'AsyncFunction',
    isUpdatedAsync: onAuthorUpdated.constructor.name === 'AsyncFunction'
  });

  // Get current client info if we're in a client-specific view
  const getClientInfo = (): Client | null => {
    const selectedClientId = authors[0]?.clientId;
    
    if (selectedClientId) {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients) as Client[];
        return clients.find(client => client.id === selectedClientId) || null;
      }
    }
    return null;
  };

  const handleSave = async (author: Author): Promise<Author> => {
    console.log('🚀 useAuthorManager.handleSave called with:', {
      authorId: author.id,
      authorName: author.name,
      isEditing: !!editingAuthor,
      authorRole: author.role,
      authorOrganization: author.organization
    });
    
    try {
      let result: Author;
      
      if (editingAuthor) {
        console.log('🚀 Calling onAuthorUpdated for existing author...');
        result = await onAuthorUpdated(author);
        console.log('🚀 onAuthorUpdated completed, result:', {
          id: result.id,
          name: result.name
        });
        toast({
          title: "Author updated",
          description: `${author.name} has been updated successfully.`
        });
      } else {
        console.log('🚀 Calling onAuthorAdded for new author...');
        result = await onAuthorAdded(author);
        console.log('🚀 onAuthorAdded completed, result:', {
          id: result.id,
          name: result.name
        });
        toast({
          title: "Author added",
          description: `${author.name} has been added successfully.`
        });
      }
      
      console.log('🚀 Save operation successful, closing form...');
      setShowForm(false);
      setEditingAuthor(null);
      return result;
    } catch (error) {
      console.error('🚀 Error in useAuthorManager.handleSave:', error);
      console.error('🚀 Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('🚀 Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('🚀 Error stack:', error instanceof Error ? error.stack : 'No stack available');
      toast({
        title: "Error",
        description: `Failed to save author: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleCancel = () => {
    console.log('🚀 useAuthorManager.handleCancel called');
    setShowForm(false);
    setEditingAuthor(null);
  };

  const handleEdit = (author: Author) => {
    console.log('🚀 useAuthorManager.handleEdit called for author:', author.name);
    setEditingAuthor(author);
    setShowForm(true);
  };

  const handleDelete = async (authorId: string) => {
    console.log('🚀 useAuthorManager.handleDelete called for author:', authorId);
    if (confirm('Are you sure you want to delete this author? This action cannot be undone.')) {
      try {
        await onAuthorDeleted(authorId);
        console.log('🚀 Author deleted successfully');
        toast({
          title: "Author deleted",
          description: "The author has been removed successfully."
        });
      } catch (error) {
        console.error('🚀 Error deleting author:', error);
        toast({
          title: "Error",
          description: "Failed to delete author. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddAuthor = () => {
    setShowForm(true);
  };

  return {
    showForm,
    editingAuthor,
    clientInfo: getClientInfo(),
    handleSave,
    handleCancel,
    handleEdit,
    handleDelete,
    handleAddAuthor
  };
};

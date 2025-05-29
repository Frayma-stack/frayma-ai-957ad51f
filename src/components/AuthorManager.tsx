
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Author, Client } from '@/types/storytelling';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import AuthorForm from './AuthorForm';
import { useToast } from '@/components/ui/use-toast';

interface AuthorManagerProps {
  authors: Author[];
  onAuthorAdded: (author: Author) => Promise<Author>;
  onAuthorUpdated: (author: Author) => Promise<Author>;
  onAuthorDeleted: (authorId: string) => Promise<void>;
}

const AuthorManager: FC<AuthorManagerProps> = ({ 
  authors, 
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const { toast } = useToast();
  
  console.log('🚀 AuthorManager initialized with:', {
    authorsCount: authors.length,
    onAuthorAddedType: typeof onAuthorAdded,
    onAuthorUpdatedType: typeof onAuthorUpdated,
    isAddedAsync: onAuthorAdded.constructor.name === 'AsyncFunction',
    isUpdatedAsync: onAuthorUpdated.constructor.name === 'AsyncFunction'
  });
  
  // Get current client info if we're in a client-specific view
  const getClientInfo = () => {
    const selectedClientId = authors[0]?.clientId;
    
    if (selectedClientId) {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients) as Client[];
        return clients.find(client => client.id === selectedClientId);
      }
    }
    return null;
  };
  
  const clientInfo = getClientInfo();
  
  const handleSave = async (author: Author): Promise<Author> => {
    console.log('🚀 AuthorManager.handleSave called with:', {
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
      console.error('🚀 Error in AuthorManager.handleSave:', error);
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
    console.log('🚀 AuthorManager.handleCancel called');
    setShowForm(false);
    setEditingAuthor(null);
  };
  
  const handleEdit = (author: Author) => {
    console.log('🚀 AuthorManager.handleEdit called for author:', author.name);
    setEditingAuthor(author);
    setShowForm(true);
  };
  
  const handleDelete = async (authorId: string) => {
    console.log('🚀 AuthorManager.handleDelete called for author:', authorId);
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-story-blue">Authors</h2>
          {clientInfo && (
            <p className="text-sm flex items-center text-gray-600">
              <Users className="h-3.5 w-3.5 mr-1" />
              For client: {clientInfo.name}
            </p>
          )}
        </div>
        {!showForm && (
          <Button 
            className="bg-story-blue hover:bg-story-light-blue"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Author
          </Button>
        )}
      </div>
      
      {showForm ? (
        <AuthorForm 
          initialAuthor={editingAuthor} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.length > 0 ? (
            authors.map(author => (
              <Card key={author.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{author.name}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(author)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(author.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {author.role} at {author.organization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-2">
                    <p className="line-clamp-3">{author.backstory}</p>
                    {author.tones.length > 0 && (
                      <div>
                        <p className="font-medium">Writing Tones:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {author.tones.map(tone => (
                            <span key={tone.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              {tone.tone}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">
                {clientInfo 
                  ? `No authors for ${clientInfo.name} yet. Add your first author to get started!` 
                  : 'No authors yet. Add your first author to get started!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorManager;

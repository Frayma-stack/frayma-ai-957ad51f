
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Author } from '@/types/storytelling';
import { Plus, Edit, Trash } from 'lucide-react';
import AuthorForm from './AuthorForm';

interface AuthorManagerProps {
  authors: Author[];
  onAuthorAdded: (author: Author) => void;
  onAuthorUpdated: (author: Author) => void;
  onAuthorDeleted: (authorId: string) => void;
}

const AuthorManager: FC<AuthorManagerProps> = ({ 
  authors, 
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  
  const handleSave = (author: Author) => {
    if (editingAuthor) {
      onAuthorUpdated(author);
    } else {
      onAuthorAdded(author);
    }
    setShowForm(false);
    setEditingAuthor(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingAuthor(null);
  };
  
  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setShowForm(true);
  };
  
  const handleDelete = (authorId: string) => {
    if (confirm('Are you sure you want to delete this author? This action cannot be undone.')) {
      onAuthorDeleted(authorId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-story-blue">Authors</h2>
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
              <p className="text-gray-500">No authors yet. Add your first author to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorManager;

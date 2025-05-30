
import { FC } from 'react';
import { Author } from '@/types/storytelling';
import AuthorForm from './AuthorForm';
import AuthorManagerHeader from './author-manager/AuthorManagerHeader';
import AuthorGrid from './author-manager/AuthorGrid';
import { useAuthorManager } from '@/hooks/useAuthorManager';

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
  const {
    showForm,
    editingAuthor,
    clientInfo,
    handleSave,
    handleCancel,
    handleEdit,
    handleDelete,
    handleAddAuthor
  } = useAuthorManager({
    authors,
    onAuthorAdded,
    onAuthorUpdated,
    onAuthorDeleted
  });

  console.log('📋 AuthorManager render:', {
    showForm,
    editingAuthor: editingAuthor?.id || null,
    authorsCount: authors.length,
    clientName: clientInfo?.name
  });

  return (
    <div className="space-y-6">
      <AuthorManagerHeader
        clientInfo={clientInfo}
        showForm={showForm}
        onAddAuthor={handleAddAuthor}
      />
      
      {showForm ? (
        <>
          <div>📝 SHOWING AUTHOR FORM</div>
          <AuthorForm 
            initialAuthor={editingAuthor} 
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <>
          <div>📊 SHOWING AUTHOR GRID</div>
          <AuthorGrid
            authors={authors}
            clientName={clientInfo?.name}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default AuthorManager;

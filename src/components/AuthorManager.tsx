
import { FC } from 'react';
import { Author } from '@/types/storytelling';
import AuthorForm from './AuthorForm';
import AuthorManagerHeader from './author-manager/AuthorManagerHeader';
import AuthorGrid from './author-manager/AuthorGrid';
import { useAuthorManager } from '@/hooks/useAuthorManager';

interface AuthorManagerProps {
  authors: Author[];
  selectedClientId?: string | null;
  onAuthorAdded: (author: Author) => Promise<Author>;
  onAuthorUpdated: (author: Author) => Promise<Author>;
  onAuthorDeleted: (authorId: string) => Promise<void>;
}

const AuthorManager: FC<AuthorManagerProps> = ({ 
  authors, 
  selectedClientId,
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
    clientName: clientInfo?.name,
    selectedClientId,
    clientAssignment: selectedClientId ? 'client_specific_mode' : 'no_client_selected'
  });

  return (
    <div className="space-y-6">
      <AuthorManagerHeader
        clientInfo={clientInfo}
        showForm={showForm}
        onAddAuthor={handleAddAuthor}
        selectedClientId={selectedClientId}
      />
      
      {showForm ? (
        <>
          <div>📝 SHOWING AUTHOR FORM</div>
          <AuthorForm 
            initialAuthor={editingAuthor} 
            selectedClientId={selectedClientId}
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

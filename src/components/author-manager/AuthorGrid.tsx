
import { FC } from 'react';
import { Author } from '@/types/storytelling';
import AuthorCard from './AuthorCard';
import AuthorEmptyState from './AuthorEmptyState';

interface AuthorGridProps {
  authors: Author[];
  clientName?: string;
  onEdit: (author: Author) => void;
  onDelete: (authorId: string) => void;
}

const AuthorGrid: FC<AuthorGridProps> = ({ 
  authors, 
  clientName, 
  onEdit, 
  onDelete 
}) => {
  if (authors.length === 0) {
    return <AuthorEmptyState clientName={clientName} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {authors.map(author => (
        <AuthorCard
          key={author.id}
          author={author}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AuthorGrid;

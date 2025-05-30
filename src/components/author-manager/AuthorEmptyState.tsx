
import { FC } from 'react';

interface AuthorEmptyStateProps {
  clientName?: string;
}

const AuthorEmptyState: FC<AuthorEmptyStateProps> = ({ clientName }) => {
  return (
    <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p className="text-gray-500">
        {clientName 
          ? `No authors for ${clientName} yet. Add your first author to get started!` 
          : 'No authors yet. Add your first author to get started!'}
      </p>
    </div>
  );
};

export default AuthorEmptyState;

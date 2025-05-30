
import { FC } from 'react';
import AuthorManager from '@/components/AuthorManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface AuthorsViewProps extends Pick<MainContentViewRouterProps, 
  'selectedClientId' | 'filteredAuthors' | 'onAuthorAdded' | 'onAuthorUpdated' | 'onAuthorDeleted'> {}

const AuthorsView: FC<AuthorsViewProps> = ({
  selectedClientId,
  filteredAuthors,
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted,
}) => {
  console.log('👀 AuthorsView render:', {
    selectedClientId,
    filteredAuthorsCount: filteredAuthors.length,
    filteredAuthorsFirst3: filteredAuthors.slice(0, 3).map(a => ({ id: a.id, name: a.name })),
    filteredAuthorsType: typeof filteredAuthors,
    filteredAuthorsIsArray: Array.isArray(filteredAuthors)
  });

  return (
    <div className="p-6">
      <AuthorManager
        authors={filteredAuthors}
        selectedClientId={selectedClientId}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
    </div>
  );
};

export default AuthorsView;

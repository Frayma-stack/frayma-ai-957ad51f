
import { FC } from 'react';
import AuthorManager from '@/components/AuthorManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface AuthorsViewProps extends Pick<MainContentViewRouterProps, 
  'filteredAuthors' | 'onAuthorAdded' | 'onAuthorUpdated' | 'onAuthorDeleted'> {}

const AuthorsView: FC<AuthorsViewProps> = ({
  filteredAuthors,
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted,
}) => {
  return (
    <div className="p-6">
      <AuthorManager
        authors={filteredAuthors}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
    </div>
  );
};

export default AuthorsView;

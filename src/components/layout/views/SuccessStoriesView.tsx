
import { FC } from 'react';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface SuccessStoriesViewProps extends Pick<MainContentViewRouterProps, 
  'filteredSuccessStories' | 'onSuccessStoryAdded' | 'onSuccessStoryUpdated' | 'onSuccessStoryDeleted'> {}

const SuccessStoriesView: FC<SuccessStoriesViewProps> = ({
  filteredSuccessStories,
  onSuccessStoryAdded,
  onSuccessStoryUpdated,
  onSuccessStoryDeleted,
}) => {
  return (
    <div className="p-6">
      <CustomerSuccessManager
        successStories={filteredSuccessStories}
        onSuccessStoryAdded={onSuccessStoryAdded}
        onSuccessStoryUpdated={onSuccessStoryUpdated}
        onSuccessStoryDeleted={onSuccessStoryDeleted}
      />
    </div>
  );
};

export default SuccessStoriesView;

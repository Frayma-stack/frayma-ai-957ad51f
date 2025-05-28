
import { FC } from 'react';
import IdeasBank from '@/components/ideas/IdeasBank';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface IdeasViewProps extends Pick<MainContentViewRouterProps, 
  'filteredICPScripts' | 'currentProductContext' | 'ideas' | 'selectedClientId' | 
  'onIdeaAdded' | 'onIdeaUpdated' | 'onIdeaDeleted' | 'onIdeaContentTypeSelect'> {}

const IdeasView: FC<IdeasViewProps> = ({
  filteredICPScripts,
  currentProductContext,
  ideas,
  selectedClientId,
  onIdeaAdded,
  onIdeaUpdated,
  onIdeaDeleted,
  onIdeaContentTypeSelect,
}) => {
  return (
    <div className="p-6">
      <IdeasBank
        scripts={filteredICPScripts}
        productContext={currentProductContext}
        ideas={ideas}
        onIdeaAdded={onIdeaAdded}
        onIdeaUpdated={onIdeaUpdated}
        onIdeaDeleted={onIdeaDeleted}
        selectedClientId={selectedClientId}
        onContentTypeSelect={onIdeaContentTypeSelect}
      />
    </div>
  );
};

export default IdeasView;

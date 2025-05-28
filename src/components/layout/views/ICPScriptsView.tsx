
import { FC } from 'react';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface ICPScriptsViewProps extends Pick<MainContentViewRouterProps, 
  'filteredICPScripts' | 'selectedClientId' | 'onICPScriptAdded' | 'onICPScriptUpdated' | 'onICPScriptDeleted'> {}

const ICPScriptsView: FC<ICPScriptsViewProps> = ({
  filteredICPScripts,
  selectedClientId,
  onICPScriptAdded,
  onICPScriptUpdated,
  onICPScriptDeleted,
}) => {
  return (
    <div className="p-6">
      <ICPStoryScriptManager
        scripts={filteredICPScripts}
        onScriptAdded={onICPScriptAdded}
        onScriptUpdated={onICPScriptUpdated}
        onScriptDeleted={onICPScriptDeleted}
        selectedClientId={selectedClientId}
      />
    </div>
  );
};

export default ICPScriptsView;

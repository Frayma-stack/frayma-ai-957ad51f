
import { FC } from 'react';
import DraftsManager from '@/components/drafts/DraftsManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface DraftsViewProps extends Pick<MainContentViewRouterProps, 'selectedClientId'> {}

const DraftsView: FC<DraftsViewProps> = ({
  selectedClientId,
}) => {
  return (
    <div className="p-6">
      <DraftsManager selectedClientId={selectedClientId} />
    </div>
  );
};

export default DraftsView;

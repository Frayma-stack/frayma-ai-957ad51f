
import { FC } from 'react';
import ClientManager from '@/components/ClientManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface ClientsViewProps extends Pick<MainContentViewRouterProps, 
  'clients' | 'selectedClientId' | 'onClientAdded' | 'onClientUpdated' | 
  'onClientDeleted' | 'onClientSelected' | 'onViewClientAssets' | 'onProductContextAdded'> {}

const ClientsView: FC<ClientsViewProps> = ({
  clients,
  selectedClientId,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onClientSelected,
  onViewClientAssets,
  onProductContextAdded,
}) => {
  return (
    <div className="p-6">
      <ClientManager
        clients={clients}
        selectedClientId={selectedClientId}
        onClientAdded={onClientAdded}
        onClientUpdated={onClientUpdated}
        onClientDeleted={onClientDeleted}
        onClientSelected={onClientSelected}
        onViewClientAssets={onViewClientAssets}
        onProductContextAdded={onProductContextAdded}
      />
    </div>
  );
};

export default ClientsView;

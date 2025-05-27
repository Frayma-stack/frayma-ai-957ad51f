
import { FC } from 'react';
import { Client } from '@/types/storytelling';
import ClientCard from './ClientCard';
import ClientManagerEmptyState from './ClientManagerEmptyState';

interface ClientGridProps {
  clients: Client[];
  selectedClientId: string | null;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onSelect: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
  onAddClient: () => void;
}

const ClientGrid: FC<ClientGridProps> = ({
  clients,
  selectedClientId,
  onEdit,
  onDelete,
  onSelect,
  onViewClientAssets,
  onAddClient,
}) => {
  if (clients.length === 0) {
    return <ClientManagerEmptyState onAddClient={onAddClient} />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          selectedClientId={selectedClientId}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          onViewClientAssets={onViewClientAssets}
        />
      ))}
    </div>
  );
};

export default ClientGrid;

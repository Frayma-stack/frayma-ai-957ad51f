import { FC, useState } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Client, ProductContext } from '@/types/storytelling';
import { useToast } from "@/hooks/use-toast";
import EnhancedClientDialog from './EnhancedClientDialog';
import ClientManagerHeader from './client-manager/ClientManagerHeader';
import ClientFilterButtons from './client-manager/ClientFilterButtons';
import ClientGrid from './client-manager/ClientGrid';

interface ClientManagerProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onClientUpdated: (client: Client, productContext?: ProductContext) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
  onProductContextAdded?: (productContext: ProductContext) => void;
}

const ClientManager: FC<ClientManagerProps> = ({
  clients,
  selectedClientId,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onClientSelected,
  onViewClientAssets,
  onProductContextAdded
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const { toast } = useToast();

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
    } else {
      setEditingClient(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleClientCreated = (client: Client, productContext?: ProductContext) => {
    console.log('ClientManager: handleClientCreated called', { client, productContext });
    
    if (editingClient) {
      // For updates, call the enhanced update handler that handles both client and product context
      onClientUpdated(client, productContext);
    } else {
      // For new clients, call the enhanced add handler
      onClientAdded(client, productContext);
    }
    
    // Don't handle product context separately here since it's now handled by the enhanced handlers
    handleCloseDialog();
  };

  const handleDelete = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This will NOT delete associated assets.')) {
      onClientDeleted(clientId);
      // If the deleted client was selected, reset to null or default
      if (selectedClientId === clientId) {
        onClientSelected(null);
      }
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    }
  };

  const handleSelectClient = (clientId: string | null) => {
    onClientSelected(clientId);
    toast({
      description: clientId 
        ? `Now viewing assets for ${clients.find(c => c.id === clientId)?.name}` 
        : "Now viewing all assets"
    });
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    onViewClientAssets(clientId, assetType);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-md">
        <ClientManagerHeader onAddClient={() => handleOpenDialog()} />
        <CardContent>
          <ClientFilterButtons
            clients={clients}
            selectedClientId={selectedClientId}
            onClientSelected={handleSelectClient}
          />

          <ClientGrid
            clients={clients}
            selectedClientId={selectedClientId}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
            onSelect={handleSelectClient}
            onViewClientAssets={handleViewClientAssets}
            onAddClient={() => handleOpenDialog()}
          />
        </CardContent>
      </Card>

      <EnhancedClientDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onClientCreated={handleClientCreated}
        editingClient={editingClient}
      />
    </div>
  );
};

export default ClientManager;
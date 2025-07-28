
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  Plus,
  Settings
} from 'lucide-react';
import { Client } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import ClientAssetsMenu from './ClientAssetsMenu';

interface ClientSectionProps {
  clients: Client[];
  ideas: GeneratedIdea[];
  selectedClientId: string | null;
  onAssetTypeChange: (type: string) => void;
  onClientAssetClick: (clientId: string, assetType: string) => void;
  onAddClientClick?: () => void;
  onClientSelected: (clientId: string | null) => void;
}

const ClientSection: FC<ClientSectionProps> = ({
  clients,
  ideas,
  selectedClientId,
  onAssetTypeChange,
  onClientAssetClick,
  onAddClientClick,
  onClientSelected,
}) => {
  const [clientsExpanded, setClientsExpanded] = useState(true);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

  const toggleClientExpansion = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleClientNameClick = (clientId: string) => {
    console.log('🎯 ClientSection: Account name clicked, selecting client:', clientId);
    onClientSelected(clientId);
    // Auto-expand the client's assets when selected
    if (!expandedClients.has(clientId)) {
      toggleClientExpansion(clientId);
    }
  };

  const handleAddClientClick = () => {
    console.log('🔘 ClientSection: Add Account button clicked - going directly to client creation');
    if (onAddClientClick) {
      onAddClientClick();
    } else {
      // Fallback to asset type change
      onAssetTypeChange('clients');
    }
  };

  const handleManageClient = (clientId: string) => {
    console.log('⚙️ ClientSection: Manage account clicked:', clientId);
    onClientSelected(clientId);
    onAssetTypeChange('clients');
  };

  return (
    <div className="space-y-1 flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Accounts</h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleAddClientClick}
            title="Add New Account"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setClientsExpanded(!clientsExpanded)}
          >
            {clientsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {clientsExpanded && (
        <div className="space-y-1">
          {clients.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No accounts added yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={handleAddClientClick}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Account
              </Button>
            </div>
          ) : (
            <>
              {clients.map(client => (
                <div key={client.id} className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex-1 justify-start text-sm font-normal pl-2 ${
                        selectedClientId === client.id ? 'bg-brand-primary/10 text-brand-primary' : ''
                      }`}
                      onClick={() => handleClientNameClick(client.id)}
                    >
                      <Users className="h-3 w-3 mr-2 text-brand-primary" />
                      <span className="truncate">{client.name}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 flex-shrink-0" 
                      onClick={() => toggleClientExpansion(client.id)}
                      title="Toggle Assets"
                    >
                      <ChevronRight 
                        className={`h-3 w-3 text-gray-400 transition-transform ${
                          expandedClients.has(client.id) ? 'rotate-90' : ''
                        }`} 
                      />
                    </Button>

                    {selectedClientId === client.id && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 flex-shrink-0" 
                        onClick={() => handleManageClient(client.id)}
                        title="Manage Account"
                      >
                        <Settings className="h-3 w-3 text-gray-400" />
                      </Button>
                    )}
                  </div>
                  
                  {expandedClients.has(client.id) && (
                    <ClientAssetsMenu
                      client={client}
                      ideas={ideas}
                      onAssetClick={onClientAssetClick}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientSection;

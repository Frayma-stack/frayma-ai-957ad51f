
import { FC } from 'react';
import { 
  Lightbulb, 
  Users, 
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientSection from './sidebar/ClientSection';

interface SidebarProps {
  ideas: any[];
  selectedClientId: string | null;
  clients: any[];
  onAssetTypeChange: (type: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onIdeasBankSelected: () => void;
  onHomeSelected?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ 
  ideas, 
  selectedClientId, 
  clients, 
  onAssetTypeChange, 
  onClientSelected,
  onIdeasBankSelected,
  onHomeSelected
}) => {
  const clientInfo = selectedClientId 
    ? clients.find(client => client.id === selectedClientId)
    : null;

  const handleClientAssetClick = (clientId: string, assetType: string) => {
    onClientSelected(clientId);
    onAssetTypeChange(assetType);
  };

  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <img 
          src="/lovable-uploads/c03df3aa-a5a4-4db8-8a06-910f2452d629.png" 
          alt="Frayma AI Logo" 
          className="h-8 w-8 mr-2" 
        />
        <div>
          <h1 className="text-xl font-sora font-semibold text-brand-primary">Frayma AI</h1>
          <p className="text-xs text-gray-600 leading-tight">Frame POVs. Auto-craft resonant, compelling GTM narratives. Win your market.</p>
        </div>
      </div>
      
      {selectedClientId && (
        <div className="mb-4 py-2 px-3 bg-brand-primary/10 rounded-md">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-brand-primary mr-2" />
            <span className="text-sm font-medium text-brand-primary">{clientInfo?.name}</span>
          </div>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs text-brand-primary p-0 h-auto mt-1"
            onClick={() => onClientSelected(null)}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="space-y-1 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sm font-normal"
          onClick={onHomeSelected}
        >
          <Home className="h-4 w-4 mr-2 text-brand-primary" />
          Home
        </Button>
      </div>
      
      {selectedClientId && (
        <div className="space-y-1 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ideas Bank</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-sm font-normal"
            onClick={onIdeasBankSelected}
          >
            <Lightbulb className="h-4 w-4 mr-2 text-brand-primary" />
            Saved Ideas
            <span className="ml-auto bg-gray-100 text-xs rounded-full px-2 py-0.5">
              {filteredIdeas.length}
            </span>
          </Button>
        </div>
      )}
      
      <ClientSection
        clients={clients}
        ideas={ideas}
        selectedClientId={selectedClientId}
        onAssetTypeChange={onAssetTypeChange}
        onClientAssetClick={handleClientAssetClick}
      />
    </div>
  );
};

export default Sidebar;

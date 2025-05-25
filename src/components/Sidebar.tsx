
import { FC } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Users, 
  User, 
  Target, 
  Trophy,
  Package,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

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
  const [assetsExpanded, setAssetsExpanded] = useState(true);
  const [clientsExpanded, setClientsExpanded] = useState(true);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  
  const clientInfo = selectedClientId 
    ? clients.find(client => client.id === selectedClientId)
    : null;

  const toggleClientExpansion = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleClientAssetClick = (clientId: string, assetType: string) => {
    onClientSelected(clientId);
    onAssetTypeChange(assetType);
  };

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
            {ideas.length}
          </span>
        </Button>
      </div>
      
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Clients & Assets</h3>
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
        
        {clientsExpanded && (
          <div className="space-y-1">
            {/* Clients Management */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('clients')}
            >
              <Users className="h-4 w-4 mr-2 text-brand-primary" />
              Manage Clients
            </Button>

            {/* Individual Clients with their assets */}
            {clients.map(client => (
              <div key={client.id} className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal pl-2"
                  onClick={() => toggleClientExpansion(client.id)}
                >
                  <ChevronRight 
                    className={`h-3 w-3 mr-1 text-gray-400 transition-transform ${
                      expandedClients.has(client.id) ? 'rotate-90' : ''
                    }`} 
                  />
                  <Users className="h-3 w-3 mr-2 text-brand-primary" />
                  <span className="truncate">{client.name}</span>
                </Button>
                
                {expandedClients.has(client.id) && (
                  <div className="ml-6 space-y-1 border-l border-gray-200 pl-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs font-normal py-1 h-auto"
                      onClick={() => handleClientAssetClick(client.id, 'authors')}
                    >
                      <User className="h-3 w-3 mr-2 text-brand-primary" />
                      Authors
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs font-normal py-1 h-auto"
                      onClick={() => handleClientAssetClick(client.id, 'icps')}
                    >
                      <Target className="h-3 w-3 mr-2 text-brand-primary" />
                      ICPs
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs font-normal py-1 h-auto"
                      onClick={() => handleClientAssetClick(client.id, 'successStories')}
                    >
                      <Trophy className="h-3 w-3 mr-2 text-brand-primary" />
                      Success Stories
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs font-normal py-1 h-auto"
                      onClick={() => handleClientAssetClick(client.id, 'productContext')}
                    >
                      <Package className="h-3 w-3 mr-2 text-brand-primary" />
                      Product Context
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Global Assets Section */}
            <div className="pt-2 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400">Global Assets</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={() => setAssetsExpanded(!assetsExpanded)}
                >
                  {assetsExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
              
              {assetsExpanded && (
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-normal"
                    onClick={() => onAssetTypeChange('authors')}
                  >
                    <User className="h-3 w-3 mr-2 text-gray-400" />
                    All Authors
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-normal"
                    onClick={() => onAssetTypeChange('icps')}
                  >
                    <Target className="h-3 w-3 mr-2 text-gray-400" />
                    All ICPs
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-normal"
                    onClick={() => onAssetTypeChange('successStories')}
                  >
                    <Trophy className="h-3 w-3 mr-2 text-gray-400" />
                    All Success Stories
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-center text-brand-primary border-brand-primary hover:bg-brand-primary/10"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Documentation
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

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
  
  const clientInfo = selectedClientId 
    ? clients.find(client => client.id === selectedClientId)
    : null;

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
      
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Assets</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setAssetsExpanded(!assetsExpanded)}
          >
            {assetsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {assetsExpanded && (
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('clients')}
            >
              <Users className="h-4 w-4 mr-2 text-brand-primary" />
              Clients
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('authors')}
            >
              <User className="h-4 w-4 mr-2 text-brand-primary" />
              Authors
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('icps')}
            >
              <Target className="h-4 w-4 mr-2 text-brand-primary" />
              ICPs
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('successStories')}
            >
              <Trophy className="h-4 w-4 mr-2 text-brand-primary" />
              Success Stories
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              onClick={() => onAssetTypeChange('productContext')}
            >
              <Package className="h-4 w-4 mr-2 text-brand-primary" />
              Product Context
            </Button>
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

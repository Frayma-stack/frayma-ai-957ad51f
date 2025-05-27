
import { FC } from 'react';
import { 
  Lightbulb, 
  Users, 
  Home
} from "lucide-react";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ClientSection from './sidebar/ClientSection';

interface AppSidebarProps {
  ideas: any[];
  selectedClientId: string | null;
  clients: any[];
  onAssetTypeChange: (type: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onIdeasBankSelected: () => void;
  onHomeSelected?: () => void;
}

export const AppSidebar: FC<AppSidebarProps> = ({ 
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
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
      </SidebarHeader>
      
      <SidebarContent className="p-4">
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

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onHomeSelected}>
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {selectedClientId && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onIdeasBankSelected}>
                    <Lightbulb className="h-4 w-4" />
                    <span>Saved Ideas</span>
                    <span className="ml-auto bg-gray-100 text-xs rounded-full px-2 py-0.5">
                      {filteredIdeas.length}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <ClientSection
          clients={clients}
          ideas={ideas}
          selectedClientId={selectedClientId}
          onAssetTypeChange={onAssetTypeChange}
          onClientAssetClick={handleClientAssetClick}
        />
      </SidebarContent>
    </Sidebar>
  );
};


import { FC, useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Lightbulb } from 'lucide-react';
import { Client } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import ClientSection from './sidebar/ClientSection';

interface AppSidebarProps {
  ideas: GeneratedIdea[];
  selectedClientId: string | null;
  clients: Client[];
  onAssetTypeChange: (type: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onIdeasBankSelected: () => void;
  onHomeSelected: () => void;
}

const AppSidebar: FC<AppSidebarProps> = ({
  ideas,
  selectedClientId,
  clients,
  onAssetTypeChange,
  onClientSelected,
  onIdeasBankSelected,
  onHomeSelected,
}) => {
  console.log('🎯 AppSidebar: Rendering with props:', {
    ideasCount: ideas.length,
    selectedClientId,
    clientsCount: clients.length
  });

  const handleClientAssetClick = (clientId: string, assetType: string) => {
    console.log('🎯 AppSidebar: Client asset clicked:', { clientId, assetType });
    onClientSelected(clientId);
    onAssetTypeChange(assetType);
  };

  const handleAddClientClick = () => {
    console.log('🔘 AppSidebar: Add Client clicked - navigating to clients view');
    onAssetTypeChange('clients');
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo and Branding Section */}
        <div className="flex items-start mb-6 p-4">
          <img 
            src="/lovable-uploads/c03df3aa-a5a4-4db8-8a06-910f2452d629.png" 
            alt="Frayma AI Logo" 
            className="h-8 w-8 mr-3 mt-1" 
          />
          <div>
            <h1 className="text-xl font-sora font-semibold text-brand-primary leading-tight">Frayma AI</h1>
            <p className="text-xs text-gray-700 leading-tight mt-1 opacity-80">
              Powered by the Product-Led Storytelling Approach & 3Rs Formula.
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupContent>
            <ClientSection
              clients={clients}
              ideas={ideas}
              selectedClientId={selectedClientId}
              onAssetTypeChange={onAssetTypeChange}
              onClientAssetClick={handleClientAssetClick}
              onAddClientClick={handleAddClientClick}
              onClientSelected={onClientSelected}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

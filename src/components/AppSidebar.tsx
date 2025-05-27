
import { FC, useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Lightbulb, User, Target, Trophy, Package } from 'lucide-react';
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

  const assetButtons = [
    { 
      id: 'authors', 
      label: 'Authors', 
      icon: User, 
      onClick: () => {
        console.log('🔘 AppSidebar: Authors clicked');
        onAssetTypeChange('authors');
      }
    },
    { 
      id: 'icp-scripts', 
      label: 'ICP Scripts', 
      icon: Target, 
      onClick: () => {
        console.log('🔘 AppSidebar: ICP Scripts clicked');
        onAssetTypeChange('icp-scripts');
      }
    },
    { 
      id: 'success-stories', 
      label: 'Success Stories', 
      icon: Trophy, 
      onClick: () => {
        console.log('🔘 AppSidebar: Success Stories clicked');
        onAssetTypeChange('success-stories');
      }
    },
    { 
      id: 'product-context', 
      label: 'Product Context', 
      icon: Package, 
      onClick: () => {
        console.log('🔘 AppSidebar: Product Context clicked');
        onAssetTypeChange('product-context');
      }
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
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
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onIdeasBankSelected}>
                  <Lightbulb className="h-4 w-4" />
                  <span>Ideas Bank</span>
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
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Assets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assetButtons.map((button) => (
                <SidebarMenuItem key={button.id}>
                  <SidebarMenuButton onClick={button.onClick}>
                    <button.icon className="h-4 w-4" />
                    <span>{button.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

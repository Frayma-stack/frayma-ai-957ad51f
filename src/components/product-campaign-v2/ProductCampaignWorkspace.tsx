import React, { useState } from 'react';
import { ProductUpdateCampaign, GTMAsset } from '@/types/productCampaign';
import { Author, ICPStoryScript } from '@/types/storytelling';
import { CampaignListing } from './CampaignListing';
import { CampaignCreationForm } from './CampaignCreationForm';
import { CampaignDashboard } from './CampaignDashboard';
import { AssetGenerator } from './AssetGenerator';

interface ProductCampaignWorkspaceProps {
  authors: Author[];
  scripts: ICPStoryScript[];
  onBack: () => void;
  selectedClientId?: string;
}

type WorkspaceView = 'listing' | 'create' | 'dashboard' | 'asset';

export const ProductCampaignWorkspace: React.FC<ProductCampaignWorkspaceProps> = ({
  authors,
  scripts,
  onBack,
  selectedClientId
}) => {
  const [currentView, setCurrentView] = useState<WorkspaceView>('listing');
  const [campaigns, setCampaigns] = useState<ProductUpdateCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<ProductUpdateCampaign | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<GTMAsset | null>(null);

  const handleCreateCampaign = () => {
    setCurrentView('create');
  };

  const handleCampaignCreated = (campaign: ProductUpdateCampaign) => {
    setCampaigns(prev => [...prev, campaign]);
    setSelectedCampaign(campaign);
    setCurrentView('dashboard');
  };

  const handleCampaignSelect = (campaign: ProductUpdateCampaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('dashboard');
  };

  const handleAssetStart = (assetType: string) => {
    if (!selectedCampaign) return;
    
    const asset = selectedCampaign.assets.find(a => a.type === assetType);
    if (asset) {
      setSelectedAsset(asset);
      setCurrentView('asset');
    }
  };

  const handleAssetResume = (asset: GTMAsset) => {
    setSelectedAsset(asset);
    setCurrentView('asset');
  };

  const handleAssetUpdate = (updatedAsset: GTMAsset) => {
    if (!selectedCampaign) return;

    const updatedCampaign = {
      ...selectedCampaign,
      assets: selectedCampaign.assets.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      ),
      updatedAt: new Date().toISOString()
    };

    setSelectedCampaign(updatedCampaign);
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
  };

  const handleBackToCampaign = () => {
    setSelectedAsset(null);
    setCurrentView('dashboard');
  };

  const handleBackToListing = () => {
    setSelectedCampaign(null);
    setSelectedAsset(null);
    setCurrentView('listing');
  };

  const handleBackToCreate = () => {
    setCurrentView('create');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'listing':
        return (
          <CampaignListing
            campaigns={campaigns}
            onBack={onBack}
            onCreateNew={handleCreateCampaign}
            onCampaignSelect={handleCampaignSelect}
          />
        );
      case 'create':
        return (
          <CampaignCreationForm
            scripts={scripts}
            selectedClientId={selectedClientId}
            onBack={handleBackToListing}
            onComplete={handleCampaignCreated}
          />
        );
      case 'dashboard':
        return selectedCampaign ? (
          <CampaignDashboard
            campaign={selectedCampaign}
            onBack={handleBackToListing}
            onAssetStart={handleAssetStart}
            onAssetResume={handleAssetResume}
          />
        ) : null;
      case 'asset':
        return selectedCampaign && selectedAsset ? (
          <AssetGenerator
            campaign={selectedCampaign}
            asset={selectedAsset}
            authors={authors}
            onBack={handleBackToCampaign}
            onAssetUpdate={handleAssetUpdate}
          />
        ) : null;
      default:
        return null;
    }
  };

  return renderCurrentView();
};
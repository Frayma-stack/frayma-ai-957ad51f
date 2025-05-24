
import { useState } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';

export const useNavigation = () => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    
    if (type === 'article') {
      // Show article sub-type selector - don't navigate yet
      return;
    }
    
    if (type === 'generate-ideas') {
      // Navigate to ideas generation
      setCurrentView('ideas');
      return;
    }
    
    // For other content types, we can add specific handling here
    console.log('Selected content type:', type);
    // TODO: Add navigation logic for other content types
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
    console.log('Selected article subtype:', subtype);
    // TODO: Navigate to article creation flow
  };

  const handleBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedType) {
      setSelectedType(null);
    } else {
      setCurrentView('home');
    }
  };

  const handleAssetTypeChange = (type: string) => {
    setCurrentView(type);
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    setSelectedClientId(clientId);
    setCurrentView(assetType);
  };

  return {
    selectedType,
    selectedArticleSubtype,
    currentView,
    selectedClientId,
    handleContentTypeSelect,
    handleArticleSubtypeSelect,
    handleBack,
    handleAssetTypeChange,
    handleClientSelected,
    handleIdeasBankSelected,
    handleHomeSelected,
    handleViewClientAssets,
  };
};

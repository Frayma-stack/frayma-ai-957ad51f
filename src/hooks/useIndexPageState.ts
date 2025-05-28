
import { useState, useEffect } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { ViewType } from '@/components/layout/AppLayout';

export const useIndexPageState = () => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  console.log('🏠 Index Page State:', {
    selectedContentType,
    selectedArticleSubtype,
    selectedAssetType,
    selectedClientId,
    currentView
  });

  // Listen for navigation events from ContentTypeSelector
  useEffect(() => {
    const handleNavigateToIdeasBank = () => {
      console.log('📥 Navigation event received: navigate-to-ideas-bank');
      handleIdeasBankSelected();
    };

    window.addEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank);
    
    return () => {
      window.removeEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank);
    };
  }, []);

  const handleContentTypeSelect = (type: ContentType) => {
    console.log('📝 Content type selected:', type);
    setSelectedContentType(type);
    setCurrentView('home');
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    console.log('📄 Article subtype selected:', subtype);
    setSelectedArticleSubtype(subtype);
  };

  const handleAssetTypeChange = (type: string) => {
    console.log('🎯 Asset type changed:', type);
    setSelectedAssetType(type);
    
    // Map asset types to views - fix the mapping for proper navigation
    const assetTypeToViewMap: Record<string, ViewType> = {
      'clients': 'clients',
      'authors': 'authors',
      'icp-scripts': 'icp-scripts',
      'success-stories': 'success-stories',
      'product-context': 'home', // Show product context in home view for selected client
      'drafts': 'home', // Show drafts in home view for selected client  
      'ideas': 'ideas'
    };
    
    const newView = assetTypeToViewMap[type] || 'home';
    console.log('🎯 Switching to view:', newView);
    setCurrentView(newView);
    
    // Clear content type selection when switching to asset management
    if (newView !== 'home') {
      setSelectedContentType(null);
      setSelectedArticleSubtype(null);
    }
  };

  const handleClientSelected = (clientId: string | null) => {
    console.log('👤 Client selected:', clientId);
    setSelectedClientId(clientId);
    if (clientId) {
      setCurrentView('home');
    }
  };

  const handleIdeasBankSelected = () => {
    console.log('💡 Ideas Bank selected');
    setCurrentView('ideas');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
    setSelectedAssetType('ideas');
  };

  const handleHomeSelected = () => {
    console.log('🏠 Home selected');
    setCurrentView('home');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
    setSelectedAssetType(null);
  };

  const handleBack = () => {
    console.log('⬅️ Back navigation triggered');
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedContentType) {
      setSelectedContentType(null);
    } else {
      setCurrentView('home');
      setSelectedAssetType(null);
    }
  };

  const handleIdeaContentTypeSelect = (ideaId: string, contentType: string) => {
    console.log('💡➡️📝 Idea content type selection:', { ideaId, contentType });
    // This could navigate to content creation with pre-selected idea
    handleContentTypeSelect(contentType as ContentType);
  };

  return {
    selectedContentType,
    selectedArticleSubtype,
    selectedAssetType,
    selectedClientId,
    currentView,
    handleContentTypeSelect,
    handleArticleSubtypeSelect,
    handleAssetTypeChange,
    handleClientSelected,
    handleIdeasBankSelected,
    handleHomeSelected,
    handleBack,
    handleIdeaContentTypeSelect,
  };
};

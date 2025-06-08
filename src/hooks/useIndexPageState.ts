
import { useState, useEffect } from 'react';
import { ContentType } from '@/components/ContentTypeSelector';
import { ArticleSubType } from '@/types/storytelling';
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
    const handleNavigateToIdeasBank = (event: CustomEvent) => {
      console.log('📥 Navigation event received: navigate-to-ideas-bank');
      // If we have a clientId from the event, set it
      if (event.detail?.clientId) {
        setSelectedClientId(event.detail.clientId);
      }
      handleIdeasBankSelected();
    };

    window.addEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank as EventListener);
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
      'product-context': 'product-context',
      'drafts': 'drafts',
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
    console.log('💡 Ideas Bank selected - navigating to ideas view');
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

  // Enhanced method to handle onboarding completion with automatic client selection and navigation
  const handleOnboardingComplete = (clientId: string) => {
    console.log('🎯 Onboarding complete, auto-selecting client and navigating to ideas:', clientId);
    setSelectedClientId(clientId);
    setCurrentView('ideas');
    setSelectedAssetType('ideas');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
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
    handleOnboardingComplete,
  };
};

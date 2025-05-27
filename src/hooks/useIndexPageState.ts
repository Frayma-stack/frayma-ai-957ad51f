
import { useState } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';

export type ViewType = 'home' | 'ideas' | 'clients' | 'authors' | 'icp-scripts' | 'success-stories';

export const useIndexPageState = () => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
  };

  const handleAssetTypeChange = (type: string) => {
    setSelectedAssetType(type);
    setCurrentView(type as ViewType);
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
  };

  const handleBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedContentType) {
      setSelectedContentType(null);
    } else {
      setCurrentView('home');
    }
  };

  const handleIdeaContentTypeSelect = (ideaId: string, contentType: string) => {
    console.log('Idea content type selected:', ideaId, contentType);
    // Implementation depends on your specific requirements
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

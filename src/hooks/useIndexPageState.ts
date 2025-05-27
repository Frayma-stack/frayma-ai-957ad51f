
import { useState } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';

export const useIndexPageState = () => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'asset' | 'ideas'>('home');

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
    setSelectedArticleSubtype(null);
    setCurrentView('home');
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
  };

  const handleAssetTypeChange = (type: string) => {
    setSelectedAssetType(type);
    setCurrentView('asset');
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
    setSelectedAssetType('');
  };

  const handleBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedContentType) {
      setSelectedContentType(null);
    } else {
      setCurrentView('home');
      setSelectedAssetType('');
    }
  };

  const handleIdeaContentTypeSelect = (ideaId: string, contentType: string) => {
    console.log('Content type selected for idea:', ideaId, contentType);
    // This could navigate to a content creation flow in the future
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

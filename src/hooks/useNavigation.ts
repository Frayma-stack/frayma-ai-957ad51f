
import { useState } from 'react';
import { ContentType } from '@/components/ContentTypeSelector';
import { ArticleSubType } from '@/types/storytelling';

export type ViewType = 'home' | 'ideas' | 'clients' | 'authors' | 'icp-scripts' | 'success-stories';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);

  const navigateToView = (view: ViewType) => {
    setCurrentView(view);
  };

  const selectContentType = (type: ContentType) => {
    setSelectedContentType(type);
  };

  const selectArticleSubtype = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
  };

  const goBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedContentType) {
      setSelectedContentType(null);
    } else {
      setCurrentView('home');
    }
  };

  const resetNavigation = () => {
    setCurrentView('home');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
  };

  return {
    currentView,
    selectedContentType,
    selectedArticleSubtype,
    navigateToView,
    selectContentType,
    selectArticleSubtype,
    goBack,
    resetNavigation,
  };
};


import { useState, useEffect } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { ViewType } from '@/components/layout/AppLayout';

interface UseAppLayoutStateProps {
  selectedContentType: ContentType | null;
  currentView: ViewType;
}

export const useAppLayoutState = ({ selectedContentType, currentView }: UseAppLayoutStateProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar when user starts doing meaningful actions
  useEffect(() => {
    const shouldCollapse = 
      selectedContentType !== null ||
      currentView === 'clients' ||
      currentView === 'authors' ||
      currentView === 'icp-scripts' ||
      currentView === 'success-stories' ||
      currentView === 'product-context' ||
      currentView === 'drafts';

    if (shouldCollapse && !sidebarCollapsed) {
      console.log('🏗️ AppLayout: Auto-collapsing sidebar');
      setSidebarCollapsed(true);
    }
  }, [selectedContentType, currentView, sidebarCollapsed]);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
  };
};

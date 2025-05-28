
import { FC, useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from '@/components/AppSidebar';
import MainContent from './MainContent';
import LoadingState from './LoadingState';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';

export type ViewType = 'home' | 'ideas' | 'clients' | 'authors' | 'icp-scripts' | 'success-stories' | 'product-context' | 'drafts';

interface AppLayoutProps {
  clients: Client[];
  authors: Author[];
  ideas: GeneratedIdea[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  selectedContentType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedAssetType: string | null;
  selectedClientId: string | null;
  currentView: ViewType;
  loading: boolean;
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onAssetTypeChange: (type: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onIdeasBankSelected: () => void;
  onHomeSelected: () => void;
  onBack: () => void;
  onIdeaContentTypeSelect: (ideaId: string, contentType: string) => void;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onClientUpdated: (client: Client, productContext?: ProductContext) => void;
  onClientDeleted: (clientId: string) => void;
  onAuthorAdded: (author: Author) => void;
  onAuthorUpdated: (author: Author) => void;
  onAuthorDeleted: (authorId: string) => void;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onICPScriptUpdated: (script: ICPStoryScript) => void;
  onICPScriptDeleted: (scriptId: string) => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
  onSuccessStoryUpdated: (story: CustomerSuccessStory) => void;
  onSuccessStoryDeleted: (storyId: string) => void;
  onProductContextAdded: (context: ProductContext) => void;
  onProductContextUpdated: (context: ProductContext) => void;
  onProductContextDeleted: (contextId: string) => void;
}

const AppLayout: FC<AppLayoutProps> = (props) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log('🏗️ AppLayout: Rendering with current view:', props.currentView);
  console.log('🏗️ AppLayout: Selected asset type:', props.selectedAssetType);

  // Auto-collapse sidebar when user starts doing meaningful actions
  useEffect(() => {
    const shouldCollapse = 
      props.selectedContentType !== null ||
      props.currentView === 'clients' ||
      props.currentView === 'authors' ||
      props.currentView === 'icp-scripts' ||
      props.currentView === 'success-stories' ||
      props.currentView === 'product-context' ||
      props.currentView === 'drafts';

    if (shouldCollapse && !sidebarCollapsed) {
      console.log('🏗️ AppLayout: Auto-collapsing sidebar');
      setSidebarCollapsed(true);
    }
  }, [props.selectedContentType, props.currentView, sidebarCollapsed]);

  // Handler for asset type changes - this should trigger view changes
  const handleAssetTypeChange = (type: string) => {
    console.log('🏗️ AppLayout: Asset type changed:', type);
    props.onAssetTypeChange(type);
  };

  // Handler for viewing client assets
  const handleViewClientAssets = (clientId: string, assetType: string) => {
    console.log('🏗️ AppLayout: View client assets:', { clientId, assetType });
    props.onAssetTypeChange(assetType);
    props.onClientSelected(clientId);
  };

  // Handler for navigating to ideas bank from home
  const handleNavigateToIdeasBank = () => {
    console.log('🏗️ AppLayout: Navigate to ideas bank');
    props.onIdeasBankSelected();
  };

  if (props.loading) {
    return <LoadingState />;
  }

  const getViewTitle = () => {
    switch (props.currentView) {
      case 'home': return 'Your Dashboard';
      case 'ideas': return 'Ideas Bank';
      case 'clients': return 'Client Manager';
      case 'authors': return 'Author Manager';
      case 'icp-scripts': return 'ICP Scripts';
      case 'success-stories': return 'Success Stories';
      case 'product-context': return 'Product Context';
      case 'drafts': return 'Drafts';
      default: return 'Your Dashboard';
    }
  };

  // Mock user for display purposes - in a real app this would come from auth context
  const mockUser = { email: 'user@example.com' };

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          ideas={props.ideas}
          selectedClientId={props.selectedClientId}
          clients={props.clients}
          onAssetTypeChange={handleAssetTypeChange}
          onClientSelected={props.onClientSelected}
          onIdeasBankSelected={props.onIdeasBankSelected}
          onHomeSelected={props.onHomeSelected}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h2 className="text-lg font-medium text-gray-900">
                {getViewTitle()}
              </h2>
            </div>
            
            <div className="text-sm text-gray-500">
              {mockUser.email}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <MainContent 
              currentView={props.currentView}
              selectedType={props.selectedContentType}
              selectedArticleSubtype={props.selectedArticleSubtype}
              selectedClientId={props.selectedClientId}
              clients={props.clients}
              authors={props.authors}
              ideas={props.ideas}
              icpScripts={props.icpScripts}
              successStories={props.successStories}
              productContexts={props.productContexts}
              onContentTypeSelect={props.onContentTypeSelect}
              onArticleSubtypeSelect={props.onArticleSubtypeSelect}
              onBack={props.onBack}
              onClientAdded={props.onClientAdded}
              onClientUpdated={props.onClientUpdated}
              onClientDeleted={props.onClientDeleted}
              onClientSelected={props.onClientSelected}
              onViewClientAssets={handleViewClientAssets}
              onAuthorAdded={props.onAuthorAdded}
              onAuthorUpdated={props.onAuthorUpdated}
              onAuthorDeleted={props.onAuthorDeleted}
              onIdeaAdded={props.onIdeaAdded}
              onIdeaUpdated={props.onIdeaUpdated}
              onIdeaDeleted={props.onIdeaDeleted}
              onICPScriptAdded={props.onICPScriptAdded}
              onICPScriptUpdated={props.onICPScriptUpdated}
              onICPScriptDeleted={props.onICPScriptDeleted}
              onSuccessStoryAdded={props.onSuccessStoryAdded}
              onSuccessStoryUpdated={props.onSuccessStoryUpdated}
              onSuccessStoryDeleted={props.onSuccessStoryDeleted}
              onProductContextAdded={props.onProductContextAdded}
              onProductContextUpdated={props.onProductContextUpdated}
              onProductContextDeleted={props.onProductContextDeleted}
              onIdeaContentTypeSelect={props.onIdeaContentTypeSelect}
              onNavigateToIdeasBank={handleNavigateToIdeasBank}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

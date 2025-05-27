
import { FC, useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import MainContent from './MainContent';
import LoadingState from './LoadingState';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';

export type ViewType = 'home' | 'ideas' | 'clients' | 'authors' | 'icp-scripts' | 'success-stories';

interface AppLayoutProps {
  user: { email: string };
  dataLoading: boolean;
  currentView: ViewType;
  selectedContentType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedAssetType: string | null;
  selectedClientId: string | null;
  clients: Client[];
  authors: Author[];
  ideas: GeneratedIdea[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  getFilteredAuthors: () => Author[];
  getFilteredICPScripts: () => ICPStoryScript[];
  getFilteredSuccessStories: () => CustomerSuccessStory[];
  getCurrentProductContext: () => ProductContext | null;
  handleProductContextCreatedOrUpdated: (productContext: ProductContext) => void;
  onAssetTypeChange: (type: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onIdeasBankSelected: () => void;
  onHomeSelected: () => void;
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
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
  onIdeaContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const AppLayout: FC<AppLayoutProps> = (props) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar when user starts doing meaningful actions
  useEffect(() => {
    const shouldCollapse = 
      props.selectedContentType !== null ||
      props.currentView === 'clients' ||
      props.currentView === 'authors' ||
      props.currentView === 'icp-scripts' ||
      props.currentView === 'success-stories';

    if (shouldCollapse && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [props.selectedContentType, props.currentView, sidebarCollapsed]);

  if (props.dataLoading) {
    return <LoadingState />;
  }

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          ideas={props.ideas}
          selectedClientId={props.selectedClientId}
          clients={props.clients}
          onAssetTypeChange={props.onAssetTypeChange}
          onClientSelected={props.onClientSelected}
          onIdeasBankSelected={props.onIdeasBankSelected}
          onHomeSelected={props.onHomeSelected}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h2 className="text-lg font-medium text-gray-900">
                {props.currentView === 'home' && 'Content Creator'}
                {props.currentView === 'ideas' && 'Ideas Bank'}
                {props.currentView === 'clients' && 'Client Manager'}
                {props.currentView === 'authors' && 'Author Manager'}
                {props.currentView === 'icp-scripts' && 'ICP Scripts'}
                {props.currentView === 'success-stories' && 'Success Stories'}
              </h2>
            </div>
            
            <div className="text-sm text-gray-500">
              {props.user.email}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <MainContent {...props} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

import { FC } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import MainContent from "./MainContent";
import LoadingState from "./LoadingState";
import { AppHeader } from "./AppHeader";
import { useAppLayoutState } from "@/hooks/useAppLayoutState";
import { useAppLayoutHandlers } from "@/hooks/useAppLayoutHandlers";
import {
  Client,
  Author,
  ICPStoryScript,
  CustomerSuccessStory,
  ProductContext,
} from "@/types/storytelling";
import { GeneratedIdea } from "@/types/ideas";
import { ContentType } from "@/components/ContentTypeSelector";
import { ArticleSubType } from "@/types/storytelling";

export type ViewType =
  | "home"
  | "ideas"
  | "clients"
  | "authors"
  | "icp-scripts"
  | "success-stories"
  | "product-context"
  | "drafts"
  | "subscription";

export interface AppLayoutProps {
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
  onAuthorAdded: (author: Author) => Promise<Author>;
  onAuthorUpdated: (author: Author) => Promise<Author>;
  onAuthorDeleted: (authorId: string) => Promise<void>;
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
  console.log("🏗️ AppLayout: Rendering with current view:", props.currentView);
  console.log("🏗️ AppLayout: Selected asset type:", props.selectedAssetType);

  const { sidebarCollapsed } = useAppLayoutState({
    selectedContentType: props.selectedContentType,
    currentView: props.currentView,
  });

  const {
    handleAssetTypeChange,
    handleViewClientAssets,
    handleNavigateToIdeasBank,
  } = useAppLayoutHandlers({
    onAssetTypeChange: props.onAssetTypeChange,
    onClientSelected: props.onClientSelected,
    onIdeasBankSelected: props.onIdeasBankSelected,
  });

  if (props.loading) {
    return <LoadingState />;
  }

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
          <AppHeader />

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

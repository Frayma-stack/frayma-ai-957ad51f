
import { FC } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavigation from './TopNavigation';
import MainContentArea from './MainContentArea';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface AppLayoutProps {
  user: { email: string };
  dataLoading: boolean;
  currentView: 'home' | 'asset' | 'ideas';
  selectedContentType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedAssetType: string;
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
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
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

const AppLayout: FC<AppLayoutProps> = ({
  user,
  dataLoading,
  currentView,
  selectedContentType,
  selectedArticleSubtype,
  selectedAssetType,
  selectedClientId,
  clients,
  authors,
  ideas,
  icpScripts,
  successStories,
  productContexts,
  getFilteredAuthors,
  getFilteredICPScripts,
  getFilteredSuccessStories,
  getCurrentProductContext,
  handleProductContextCreatedOrUpdated,
  onAssetTypeChange,
  onClientSelected,
  onIdeasBankSelected,
  onHomeSelected,
  onContentTypeSelect,
  onArticleSubtypeSelect,
  onBack,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted,
  onIdeaAdded,
  onIdeaUpdated,
  onIdeaDeleted,
  onICPScriptAdded,
  onICPScriptUpdated,
  onICPScriptDeleted,
  onSuccessStoryAdded,
  onSuccessStoryUpdated,
  onSuccessStoryDeleted,
  onProductContextAdded,
  onProductContextUpdated,
  onProductContextDeleted,
  onIdeaContentTypeSelect,
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        ideas={ideas}
        selectedClientId={selectedClientId}
        clients={clients}
        onAssetTypeChange={onAssetTypeChange}
        onClientSelected={onClientSelected}
        onIdeasBankSelected={onIdeasBankSelected}
        onHomeSelected={onHomeSelected}
      />
      
      <div className="flex-1 overflow-hidden">
        <TopNavigation
          currentView={currentView}
          selectedAssetType={selectedAssetType}
          userEmail={user.email}
        />

        <main className="flex-1 overflow-auto p-6">
          <MainContentArea
            dataLoading={dataLoading}
            currentView={currentView}
            selectedContentType={selectedContentType}
            selectedArticleSubtype={selectedArticleSubtype}
            selectedAssetType={selectedAssetType}
            selectedClientId={selectedClientId}
            clients={clients}
            authors={authors}
            ideas={ideas}
            icpScripts={icpScripts}
            successStories={successStories}
            productContexts={productContexts}
            getFilteredAuthors={getFilteredAuthors}
            getFilteredICPScripts={getFilteredICPScripts}
            getFilteredSuccessStories={getFilteredSuccessStories}
            getCurrentProductContext={getCurrentProductContext}
            handleProductContextCreatedOrUpdated={handleProductContextCreatedOrUpdated}
            onContentTypeSelect={onContentTypeSelect}
            onArticleSubtypeSelect={onArticleSubtypeSelect}
            onBack={onBack}
            onClientAdded={onClientAdded}
            onClientUpdated={onClientUpdated}
            onClientDeleted={onClientDeleted}
            onAuthorAdded={onAuthorAdded}
            onAuthorUpdated={onAuthorUpdated}
            onAuthorDeleted={onAuthorDeleted}
            onIdeaAdded={onIdeaAdded}
            onIdeaUpdated={onIdeaUpdated}
            onIdeaDeleted={onIdeaDeleted}
            onICPScriptAdded={onICPScriptAdded}
            onICPScriptUpdated={onICPScriptUpdated}
            onICPScriptDeleted={onICPScriptDeleted}
            onSuccessStoryAdded={onSuccessStoryAdded}
            onSuccessStoryUpdated={onSuccessStoryUpdated}
            onSuccessStoryDeleted={onSuccessStoryDeleted}
            onProductContextAdded={onProductContextAdded}
            onProductContextUpdated={onProductContextUpdated}
            onProductContextDeleted={onProductContextDeleted}
            onIdeaContentTypeSelect={onIdeaContentTypeSelect}
          />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

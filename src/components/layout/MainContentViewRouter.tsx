
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ViewType } from '@/components/layout/AppLayout';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import ProductContextManager from '@/components/ProductContextManager';
import DraftsManager from '@/components/drafts/DraftsManager';

interface MainContentViewRouterProps {
  currentView: ViewType;
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedClientId: string | null;
  clients: Client[];
  filteredAuthors: Author[];
  filteredICPScripts: ICPStoryScript[];
  filteredSuccessStories: CustomerSuccessStory[];
  currentProductContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onClientUpdated: (client: Client, productContext?: ProductContext) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
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
  onNavigateToIdeasBank?: () => void;
}

const MainContentViewRouter: FC<MainContentViewRouterProps> = ({
  currentView,
  selectedType,
  selectedArticleSubtype,
  selectedClientId,
  clients,
  filteredAuthors,
  filteredICPScripts,
  filteredSuccessStories,
  currentProductContext,
  ideas,
  onContentTypeSelect,
  onArticleSubtypeSelect,
  onBack,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onClientSelected,
  onViewClientAssets,
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
  onNavigateToIdeasBank,
}) => {
  if (currentView === 'clients') {
    return (
      <div className="p-6">
        <ClientManager
          clients={clients}
          selectedClientId={selectedClientId}
          onClientAdded={onClientAdded}
          onClientUpdated={onClientUpdated}
          onClientDeleted={onClientDeleted}
          onClientSelected={onClientSelected}
          onViewClientAssets={onViewClientAssets}
          onProductContextAdded={onProductContextAdded}
        />
      </div>
    );
  }

  if (currentView === 'authors') {
    return (
      <div className="p-6">
        <AuthorManager
          authors={filteredAuthors}
          onAuthorAdded={onAuthorAdded}
          onAuthorUpdated={onAuthorUpdated}
          onAuthorDeleted={onAuthorDeleted}
        />
      </div>
    );
  }

  if (currentView === 'icp-scripts') {
    return (
      <div className="p-6">
        <ICPStoryScriptManager
          scripts={filteredICPScripts}
          onScriptAdded={onICPScriptAdded}
          onScriptUpdated={onICPScriptUpdated}
          onScriptDeleted={onICPScriptDeleted}
          selectedClientId={selectedClientId}
        />
      </div>
    );
  }

  if (currentView === 'success-stories') {
    return (
      <div className="p-6">
        <CustomerSuccessManager
          successStories={filteredSuccessStories}
          onSuccessStoryAdded={onSuccessStoryAdded}
          onSuccessStoryUpdated={onSuccessStoryUpdated}
          onSuccessStoryDeleted={onSuccessStoryDeleted}
        />
      </div>
    );
  }

  if (currentView === 'product-context') {
    return (
      <div className="p-6">
        <ProductContextManager
          productContext={currentProductContext}
          onProductContextUpdated={onProductContextUpdated}
        />
      </div>
    );
  }

  if (currentView === 'drafts') {
    return (
      <div className="p-6">
        <DraftsManager selectedClientId={selectedClientId} />
      </div>
    );
  }

  if (currentView === 'ideas') {
    return (
      <div className="p-6">
        <IdeasBank
          scripts={filteredICPScripts}
          productContext={currentProductContext}
          ideas={ideas}
          onIdeaAdded={onIdeaAdded}
          onIdeaUpdated={onIdeaUpdated}
          onIdeaDeleted={onIdeaDeleted}
          selectedClientId={selectedClientId}
          onContentTypeSelect={onIdeaContentTypeSelect}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="p-6">
      <HomeViewRouter
        selectedType={selectedType}
        selectedArticleSubtype={selectedArticleSubtype}
        filteredICPScripts={filteredICPScripts}
        filteredSuccessStories={filteredSuccessStories}
        filteredAuthors={filteredAuthors}
        currentProductContext={currentProductContext}
        ideas={ideas}
        selectedClientId={selectedClientId}
        onContentTypeSelect={onContentTypeSelect}
        onArticleSubtypeSelect={onArticleSubtypeSelect}
        onBack={onBack}
        onSuccessStoryAdded={onSuccessStoryAdded}
        onNavigateToIdeasBank={onNavigateToIdeasBank}
      />
    </div>
  );
};

export default MainContentViewRouter;


import { FC } from 'react';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import ProductContextManager from '@/components/ProductContextManager';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface AssetViewRouterProps {
  currentView: string;
  selectedClientId: string | null;
  clients: Client[];
  filteredAuthors: Author[];
  filteredICPScripts: ICPStoryScript[];
  filteredSuccessStories: CustomerSuccessStory[];
  currentProductContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
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
  handleProductContextCreatedOrUpdated: (productContext: ProductContext) => void;
  onIdeaContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const AssetViewRouter: FC<AssetViewRouterProps> = ({
  currentView,
  selectedClientId,
  clients,
  filteredAuthors,
  filteredICPScripts,
  filteredSuccessStories,
  currentProductContext,
  ideas,
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
  handleProductContextCreatedOrUpdated,
  onIdeaContentTypeSelect,
}) => {
  if (currentView === 'clients') {
    return (
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
    );
  }

  if (currentView === 'authors') {
    return (
      <AuthorManager
        authors={filteredAuthors}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
    );
  }

  if (currentView === 'ideas') {
    return (
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
    );
  }

  if (currentView === 'icps') {
    return (
      <ICPStoryScriptManager
        scripts={filteredICPScripts}
        onScriptAdded={onICPScriptAdded}
        onScriptUpdated={onICPScriptUpdated}
        onScriptDeleted={onICPScriptDeleted}
        selectedClientId={selectedClientId}
      />
    );
  }

  if (currentView === 'successStories') {
    return (
      <CustomerSuccessManager
        successStories={filteredSuccessStories}
        onSuccessStoryAdded={onSuccessStoryAdded}
        onSuccessStoryUpdated={onSuccessStoryUpdated}
        onSuccessStoryDeleted={onSuccessStoryDeleted}
      />
    );
  }

  if (currentView === 'productContext') {
    return (
      <ProductContextManager
        productContext={currentProductContext}
        onProductContextUpdated={handleProductContextCreatedOrUpdated}
      />
    );
  }

  // Placeholder for other asset types
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-gray-700">{currentView}</h2>
      <p className="text-gray-500 mt-2">This section is coming soon</p>
    </div>
  );
};

export default AssetViewRouter;

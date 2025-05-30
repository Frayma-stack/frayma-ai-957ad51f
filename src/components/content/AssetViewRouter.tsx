import { FC } from 'react';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import ProductContextManager from '@/components/ProductContextManager';
import DraftsManager from '@/components/drafts/DraftsManager';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface AssetViewRouterProps {
  currentView?: string;
  selectedAssetType: string;
  selectedClientId: string | null;
  clients: Client[];
  authors?: Author[];
  filteredAuthors?: Author[];
  icpScripts?: ICPStoryScript[];
  filteredICPScripts?: ICPStoryScript[];
  successStories?: CustomerSuccessStory[];
  filteredSuccessStories?: CustomerSuccessStory[];
  productContexts?: ProductContext[];
  currentProductContext?: ProductContext | null;
  ideas?: GeneratedIdea[];
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected?: (clientId: string | null) => void;
  onViewClientAssets?: (clientId: string, assetType: string) => void;
  onAuthorAdded: (author: Author) => Promise<Author>;
  onAuthorUpdated: (author: Author) => Promise<Author>;
  onAuthorDeleted: (authorId: string) => Promise<void>;
  onIdeaAdded?: (idea: GeneratedIdea) => void;
  onIdeaUpdated?: (idea: GeneratedIdea) => void;
  onIdeaDeleted?: (ideaId: string) => void;
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onICPScriptUpdated: (script: ICPStoryScript) => void;
  onICPScriptDeleted: (scriptId: string) => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
  onSuccessStoryUpdated: (story: CustomerSuccessStory) => void;
  onSuccessStoryDeleted: (storyId: string) => void;
  onProductContextAdded?: (context: ProductContext) => void;
  onProductContextUpdated?: (context: ProductContext) => void;
  onProductContextDeleted?: (contextId: string) => void;
  handleProductContextCreatedOrUpdated: (productContext: ProductContext) => void;
  onIdeaContentTypeSelect?: (ideaId: string, contentType: string) => void;
}

const AssetViewRouter: FC<AssetViewRouterProps> = ({
  selectedAssetType,
  selectedClientId,
  clients,
  authors = [],
  filteredAuthors,
  icpScripts = [],
  filteredICPScripts,
  successStories = [],
  filteredSuccessStories,
  currentProductContext,
  ideas = [],
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
  handleProductContextCreatedOrUpdated,
  onIdeaContentTypeSelect,
}) => {
  // Use filtered data if available, otherwise fall back to original arrays
  const authorsToUse = filteredAuthors || authors;
  const icpScriptsToUse = filteredICPScripts || icpScripts;
  const successStoriesToUse = filteredSuccessStories || successStories;

  console.log('🎯 AssetViewRouter: selectedAssetType =', selectedAssetType, 'selectedClientId =', selectedClientId);

  if (selectedAssetType === 'clients') {
    return (
      <ClientManager
        clients={clients}
        selectedClientId={selectedClientId}
        onClientAdded={onClientAdded}
        onClientUpdated={onClientUpdated}
        onClientDeleted={onClientDeleted}
        onClientSelected={() => {}}
        onViewClientAssets={() => {}}
        onProductContextAdded={onProductContextAdded || (() => {})}
      />
    );
  }

  if (selectedAssetType === 'authors') {
    console.log('🎯 AssetViewRouter: Rendering AuthorManager with selectedClientId:', selectedClientId);
    return (
      <AuthorManager
        authors={authorsToUse}
        selectedClientId={selectedClientId}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
    );
  }

  if (selectedAssetType === 'icps') {
    return (
      <ICPStoryScriptManager
        scripts={icpScriptsToUse}
        onScriptAdded={onICPScriptAdded}
        onScriptUpdated={onICPScriptUpdated}
        onScriptDeleted={onICPScriptDeleted}
        selectedClientId={selectedClientId}
      />
    );
  }

  if (selectedAssetType === 'successStories') {
    return (
      <CustomerSuccessManager
        successStories={successStoriesToUse}
        onSuccessStoryAdded={onSuccessStoryAdded}
        onSuccessStoryUpdated={onSuccessStoryUpdated}
        onSuccessStoryDeleted={onSuccessStoryDeleted}
      />
    );
  }

  if (selectedAssetType === 'productContext') {
    return (
      <ProductContextManager
        productContext={currentProductContext}
        onProductContextUpdated={handleProductContextCreatedOrUpdated}
      />
    );
  }

  if (selectedAssetType === 'drafts') {
    return (
      <DraftsManager selectedClientId={selectedClientId} />
    );
  }

  if (selectedAssetType === 'ideas') {
    return (
      <IdeasBank
        scripts={icpScriptsToUse}
        productContext={currentProductContext}
        ideas={ideas}
        onIdeaAdded={onIdeaAdded || (() => {})}
        onIdeaUpdated={onIdeaUpdated || (() => {})}
        onIdeaDeleted={onIdeaDeleted || (() => {})}
        selectedClientId={selectedClientId}
        onContentTypeSelect={onIdeaContentTypeSelect || (() => {})}
      />
    );
  }

  // Placeholder for other asset types
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-gray-700">{selectedAssetType}</h2>
      <p className="text-gray-500 mt-2">This section is coming soon</p>
    </div>
  );
};

export default AssetViewRouter;

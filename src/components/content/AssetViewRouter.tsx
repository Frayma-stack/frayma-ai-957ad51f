
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
  selectedAssetType: string;
  selectedClientId: string | null;
  clients: Client[];
  authors: Author[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
  onClientDeleted: (clientId: string) => void;
  onAuthorAdded: (author: Author) => void;
  onAuthorUpdated: (author: Author) => void;
  onAuthorDeleted: (authorId: string) => void;
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
}

const AssetViewRouter: FC<AssetViewRouterProps> = ({
  selectedAssetType,
  selectedClientId,
  clients,
  authors,
  icpScripts,
  successStories,
  productContexts,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onAuthorAdded,
  onAuthorUpdated,
  onAuthorDeleted,
  onICPScriptAdded,
  onICPScriptUpdated,
  onICPScriptDeleted,
  onSuccessStoryAdded,
  onSuccessStoryUpdated,
  onSuccessStoryDeleted,
  onProductContextAdded,
  handleProductContextCreatedOrUpdated,
}) => {
  // Filter data based on selected client
  const filteredAuthors = selectedClientId 
    ? authors.filter(author => author.clientId === selectedClientId)
    : authors;
  
  const filteredICPScripts = selectedClientId 
    ? icpScripts.filter(script => script.clientId === selectedClientId)
    : icpScripts;
  
  const filteredSuccessStories = selectedClientId 
    ? successStories.filter(story => story.clientId === selectedClientId)
    : successStories;

  const currentProductContext = selectedClientId 
    ? productContexts.find(context => context.clientId === selectedClientId) || null
    : null;

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
        onProductContextAdded={onProductContextAdded}
      />
    );
  }

  if (selectedAssetType === 'authors') {
    return (
      <AuthorManager
        authors={filteredAuthors}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
    );
  }

  if (selectedAssetType === 'icps') {
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

  if (selectedAssetType === 'successStories') {
    return (
      <CustomerSuccessManager
        successStories={filteredSuccessStories}
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

  // Placeholder for other asset types
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-gray-700">{selectedAssetType}</h2>
      <p className="text-gray-500 mt-2">This section is coming soon</p>
    </div>
  );
};

export default AssetViewRouter;

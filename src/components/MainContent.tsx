
import { FC } from 'react';
import { ContentType } from '@/components/ContentTypeSelector';
import { ArticleSubType } from '@/types/storytelling';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import AssetViewRouter from '@/components/content/AssetViewRouter';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import { useProductContextManager } from '@/hooks/useProductContextManager';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface MainContentProps {
  currentView: string;
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedClientId: string | null;
  clients: Client[];
  authors: Author[];
  ideas: GeneratedIdea[];
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
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
  onIdeaContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const MainContent: FC<MainContentProps> = ({
  currentView,
  selectedType,
  selectedArticleSubtype,
  selectedClientId,
  clients,
  authors,
  ideas,
  icpScripts,
  successStories,
  productContexts,
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
}) => {
  const {
    getFilteredAuthors,
    getFilteredICPScripts,
    getFilteredSuccessStories,
    getCurrentProductContext,
  } = useContentFiltering({
    selectedClientId,
    authors,
    icpScripts,
    successStories,
    productContexts,
  });

  const { handleProductContextCreatedOrUpdated } = useProductContextManager({
    selectedClientId,
    getCurrentProductContext,
    onProductContextAdded,
    onProductContextUpdated,
  });

  if (currentView === 'home') {
    return (
      <HomeViewRouter
        selectedType={selectedType}
        selectedArticleSubtype={selectedArticleSubtype}
        filteredICPScripts={getFilteredICPScripts()}
        filteredSuccessStories={getFilteredSuccessStories()}
        filteredAuthors={getFilteredAuthors()}
        currentProductContext={getCurrentProductContext()}
        ideas={ideas}
        selectedClientId={selectedClientId}
        onContentTypeSelect={onContentTypeSelect}
        onArticleSubtypeSelect={onArticleSubtypeSelect}
        onBack={onBack}
        onSuccessStoryAdded={onSuccessStoryAdded}
      />
    );
  }

  return (
    <AssetViewRouter
      currentView={currentView}
      selectedAssetType={currentView}
      selectedClientId={selectedClientId}
      clients={clients}
      filteredAuthors={getFilteredAuthors()}
      filteredICPScripts={getFilteredICPScripts()}
      filteredSuccessStories={getFilteredSuccessStories()}
      currentProductContext={getCurrentProductContext()}
      ideas={ideas}
      onClientAdded={onClientAdded}
      onClientUpdated={onClientUpdated}
      onClientDeleted={onClientDeleted}
      onClientSelected={onClientSelected}
      onViewClientAssets={onViewClientAssets}
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
      handleProductContextCreatedOrUpdated={handleProductContextCreatedOrUpdated}
      onIdeaContentTypeSelect={onIdeaContentTypeSelect}
    />
  );
};

export default MainContent;

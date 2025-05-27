
import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import AssetViewRouter from '@/components/content/AssetViewRouter';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import IdeasBank from '@/components/ideas/IdeasBank';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface MainContentAreaProps {
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

const MainContentArea: FC<MainContentAreaProps> = ({
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
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (currentView === 'ideas') {
    return (
      <IdeasBank
        scripts={getFilteredICPScripts()}
        productContext={getCurrentProductContext()}
        ideas={ideas}
        onIdeaAdded={onIdeaAdded}
        onIdeaUpdated={onIdeaUpdated}
        onIdeaDeleted={onIdeaDeleted}
        selectedClientId={selectedClientId}
        onContentTypeSelect={onIdeaContentTypeSelect}
      />
    );
  }

  if (currentView === 'asset') {
    return (
      <AssetViewRouter
        selectedAssetType={selectedAssetType}
        selectedClientId={selectedClientId}
        clients={clients}
        authors={authors}
        filteredAuthors={getFilteredAuthors()}
        icpScripts={icpScripts}
        filteredICPScripts={getFilteredICPScripts()}
        successStories={successStories}
        filteredSuccessStories={getFilteredSuccessStories()}
        productContexts={productContexts}
        currentProductContext={getCurrentProductContext()}
        ideas={ideas}
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
        handleProductContextCreatedOrUpdated={handleProductContextCreatedOrUpdated}
        onIdeaContentTypeSelect={onIdeaContentTypeSelect}
      />
    );
  }

  return (
    <HomeViewRouter
      selectedType={selectedContentType}
      selectedArticleSubtype={selectedArticleSubtype}
      filteredICPScripts={getFilteredICPScripts()}
      filteredSuccessStories={getFilteredSuccessStories()}
      filteredAuthors={getFilteredAuthors()}
      currentProductContext={getCurrentProductContext()}
      ideas={ideas}
      onContentTypeSelect={onContentTypeSelect}
      onArticleSubtypeSelect={onArticleSubtypeSelect}
      onBack={onBack}
      onSuccessStoryAdded={onSuccessStoryAdded}
    />
  );
};

export default MainContentArea;

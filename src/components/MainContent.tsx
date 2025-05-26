import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import GTMNarrativeCreator from '@/components/GTMNarrativeCreator';
import SuccessStoryCreator from '@/components/SuccessStoryCreator';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import ProductContextManager from '@/components/ProductContextManager';
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
}) => {
  const getFilteredAuthors = () => {
    if (selectedClientId) {
      return authors.filter(author => author.clientId === selectedClientId);
    }
    return authors;
  };

  const getFilteredICPScripts = () => {
    if (selectedClientId) {
      return icpScripts.filter(script => script.clientId === selectedClientId);
    }
    return icpScripts;
  };

  const getFilteredSuccessStories = () => {
    if (selectedClientId) {
      return successStories.filter(story => story.clientId === selectedClientId);
    }
    return successStories;
  };

  const getFilteredProductContexts = () => {
    if (selectedClientId) {
      return productContexts.filter(context => context.clientId === selectedClientId);
    }
    return productContexts;
  };

  // Get the first product context for the selected client (ProductContextManager expects a single context)
  const getCurrentProductContext = () => {
    const filtered = getFilteredProductContexts();
    return filtered.length > 0 ? filtered[0] : null;
  };

  // Handle product context creation when none exists
  const handleProductContextCreatedOrUpdated = (productContext: ProductContext) => {
    const existingContext = getCurrentProductContext();
    if (existingContext) {
      onProductContextUpdated(productContext);
    } else {
      // Set clientId if we have a selected client
      if (selectedClientId) {
        productContext.clientId = selectedClientId;
      }
      onProductContextAdded(productContext);
    }
  };

  if (currentView === 'home') {
    if (selectedType === 'article' && !selectedArticleSubtype) {
      return (
        <ArticleTypeSelector 
          onSelect={onArticleSubtypeSelect}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'article' && selectedArticleSubtype) {
      return (
        <GTMNarrativeCreator
          articleSubType={selectedArticleSubtype}
          scripts={getFilteredICPScripts()}
          successStories={getFilteredSuccessStories()}
          ideas={ideas}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'success-story') {
      return (
        <SuccessStoryCreator 
          scripts={getFilteredICPScripts()}
          successStories={getFilteredSuccessStories()}
          authors={getFilteredAuthors()}
          productContext={getCurrentProductContext()}
          onBack={onBack}
          onStoryCreated={onSuccessStoryAdded}
        />
      );
    } else if (selectedType === 'linkedin') {
      return (
        <ShortFormContentCreator 
          contentType="linkedin"
          scripts={getFilteredICPScripts()}
          authors={getFilteredAuthors()}
          successStories={getFilteredSuccessStories()}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'email') {
      return (
        <ShortFormContentCreator 
          contentType="email"
          scripts={getFilteredICPScripts()}
          authors={getFilteredAuthors()}
          successStories={getFilteredSuccessStories()}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'custom') {
      return (
        <ShortFormContentCreator 
          contentType="custom"
          scripts={getFilteredICPScripts()}
          authors={getFilteredAuthors()}
          successStories={getFilteredSuccessStories()}
          onBack={onBack}
        />
      );
    } else {
      return (
        <ContentTypeSelector 
          onSelect={onContentTypeSelect}
        />
      );
    }
  }

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
        authors={getFilteredAuthors()}
        onAuthorAdded={onAuthorAdded}
        onAuthorUpdated={onAuthorUpdated}
        onAuthorDeleted={onAuthorDeleted}
      />
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
      />
    );
  }

  if (currentView === 'icps') {
    return (
      <ICPStoryScriptManager
        scripts={getFilteredICPScripts()}
        onScriptAdded={onICPScriptAdded}
        onScriptUpdated={onICPScriptUpdated}
        onScriptDeleted={onICPScriptDeleted}
      />
    );
  }

  if (currentView === 'successStories') {
    return (
      <CustomerSuccessManager
        successStories={getFilteredSuccessStories()}
        onSuccessStoryAdded={onSuccessStoryAdded}
        onSuccessStoryUpdated={onSuccessStoryUpdated}
        onSuccessStoryDeleted={onSuccessStoryDeleted}
      />
    );
  }

  if (currentView === 'productContext') {
    return (
      <ProductContextManager
        productContext={getCurrentProductContext()}
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

export default MainContent;

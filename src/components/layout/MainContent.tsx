
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import SuccessStoryManager from '@/components/SuccessStoryManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import { ViewType } from '@/components/layout/AppLayout';

interface MainContentProps {
  currentView: ViewType;
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
  onNavigateToIdeasBank,
}) => {
  // Filter data based on selected client
  const getFilteredAuthors = () => {
    return selectedClientId 
      ? authors.filter(author => author.clientId === selectedClientId)
      : authors;
  };

  const getFilteredICPScripts = () => {
    return selectedClientId 
      ? icpScripts.filter(script => script.clientId === selectedClientId)
      : icpScripts;
  };

  const getFilteredSuccessStories = () => {
    return selectedClientId 
      ? successStories.filter(story => story.clientId === selectedClientId)
      : successStories;
  };

  const getCurrentProductContext = () => {
    return selectedClientId 
      ? productContexts.find(context => context.clientId === selectedClientId) || null
      : null;
  };

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
          authors={getFilteredAuthors()}
          onAuthorAdded={onAuthorAdded}
          onAuthorUpdated={onAuthorUpdated}
          onAuthorDeleted={onAuthorDeleted}
          selectedClientId={selectedClientId}
        />
      </div>
    );
  }

  if (currentView === 'icp-scripts') {
    return (
      <div className="p-6">
        <ICPStoryScriptManager
          scripts={getFilteredICPScripts()}
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
        <SuccessStoryManager
          stories={getFilteredSuccessStories()}
          onStoryAdded={onSuccessStoryAdded}
          onStoryUpdated={onSuccessStoryUpdated}
          onStoryDeleted={onSuccessStoryDeleted}
          selectedClientId={selectedClientId}
        />
      </div>
    );
  }

  if (currentView === 'ideas') {
    return (
      <div className="p-6">
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
      </div>
    );
  }

  // Home view
  return (
    <div className="p-6">
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
        onNavigateToIdeasBank={onNavigateToIdeasBank}
      />
    </div>
  );
};

export default MainContent;

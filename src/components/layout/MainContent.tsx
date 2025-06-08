
import { FC } from 'react';
import { ContentType } from '@/components/ContentTypeSelector';
import { ArticleSubType } from '@/types/storytelling';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ViewType } from '@/components/layout/AppLayout';
import MainContentViewRouter from './MainContentViewRouter';
import ProductContextManager from '@/components/ProductContextManager';
import DraftsManager from '@/components/drafts/DraftsManager';

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
  onNavigateToIdeasBank: () => void;
}

const MainContent: FC<MainContentProps> = (props) => {
  const {
    selectedClientId,
    productContexts,
    onProductContextUpdated,
    currentView,
  } = props;

  // Get current product context for the selected client
  const getCurrentProductContext = () => {
    return selectedClientId 
      ? productContexts.find(context => context.clientId === selectedClientId) || null
      : null;
  };

  const getFilteredAuthors = () => {
    console.log('🔍 MainContent.getFilteredAuthors called:', {
      selectedClientId,
      currentView,
      totalAuthors: props.authors.length,
      authorsFirst3: props.authors.slice(0, 3).map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
    });

    // When in the dedicated authors view, show all authors regardless of selected client
    if (currentView === 'authors') {
      console.log('🔍 In authors view - returning all authors:', props.authors.length);
      return props.authors;
    }

    // For other views, filter by client if one is selected
    const filtered = selectedClientId 
      ? props.authors.filter(author => author.clientId === selectedClientId)
      : props.authors;

    console.log('🔍 Filtered authors result:', {
      filteredCount: filtered.length,
      filteredFirst3: filtered.slice(0, 3).map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
    });

    return filtered;
  };

  const getFilteredICPScripts = () => {
    return selectedClientId 
      ? props.icpScripts.filter(script => script.clientId === selectedClientId)
      : props.icpScripts;
  };

  const getFilteredSuccessStories = () => {
    return selectedClientId 
      ? props.successStories.filter(story => story.clientId === selectedClientId)
      : props.successStories;
  };

  // Check if we're in a special client asset view that should show specific content
  const isProductContextView = props.currentView === 'home' && selectedClientId && 
    (typeof window !== 'undefined' && window.location.hash === '#product-context');
  
  const isDraftsView = props.currentView === 'home' && selectedClientId && 
    (typeof window !== 'undefined' && window.location.hash === '#drafts');

  // Handle special client asset views
  if (isProductContextView) {
    return (
      <div className="p-6">
        <ProductContextManager
          productContext={getCurrentProductContext()}
          onProductContextUpdated={onProductContextUpdated}
        />
      </div>
    );
  }

  if (isDraftsView) {
    return (
      <div className="p-6">
        <DraftsManager selectedClientId={selectedClientId} />
      </div>
    );
  }

  return (
    <MainContentViewRouter
      currentView={props.currentView}
      selectedType={props.selectedType}
      selectedArticleSubtype={props.selectedArticleSubtype}
      selectedClientId={selectedClientId}
      clients={props.clients}
      filteredAuthors={getFilteredAuthors()}
      filteredICPScripts={getFilteredICPScripts()}
      filteredSuccessStories={getFilteredSuccessStories()}
      currentProductContext={getCurrentProductContext()}
      ideas={props.ideas}
      onContentTypeSelect={props.onContentTypeSelect}
      onArticleSubtypeSelect={props.onArticleSubtypeSelect}
      onBack={props.onBack}
      onClientAdded={props.onClientAdded}
      onClientUpdated={props.onClientUpdated}
      onClientDeleted={props.onClientDeleted}
      onClientSelected={props.onClientSelected}
      onViewClientAssets={props.onViewClientAssets}
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
      onNavigateToIdeasBank={props.onNavigateToIdeasBank}
    />
  );
};

export default MainContent;

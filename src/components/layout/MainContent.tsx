
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ViewType } from '@/components/layout/AppLayout';
import { useMainContentFiltering } from '@/hooks/useMainContentFiltering';
import MainContentViewRouter from './MainContentViewRouter';

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
  const {
    filteredAuthors,
    filteredICPScripts,
    filteredSuccessStories,
    currentProductContext,
  } = useMainContentFiltering({
    selectedClientId,
    authors,
    icpScripts,
    successStories,
    productContexts,
  });

  return (
    <MainContentViewRouter
      currentView={currentView}
      selectedType={selectedType}
      selectedArticleSubtype={selectedArticleSubtype}
      selectedClientId={selectedClientId}
      clients={clients}
      filteredAuthors={filteredAuthors}
      filteredICPScripts={filteredICPScripts}
      filteredSuccessStories={filteredSuccessStories}
      currentProductContext={currentProductContext}
      ideas={ideas}
      onContentTypeSelect={onContentTypeSelect}
      onArticleSubtypeSelect={onArticleSubtypeSelect}
      onBack={onBack}
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
      onIdeaContentTypeSelect={onIdeaContentTypeSelect}
      onNavigateToIdeasBank={onNavigateToIdeasBank}
    />
  );
};

export default MainContent;

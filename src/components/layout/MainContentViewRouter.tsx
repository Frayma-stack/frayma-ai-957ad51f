
import { FC } from 'react';
import { MainContentViewRouterProps } from './types/MainContentViewRouterTypes';
import ClientsView from './views/ClientsView';
import AuthorsView from './views/AuthorsView';
import ICPScriptsView from './views/ICPScriptsView';
import SuccessStoriesView from './views/SuccessStoriesView';
import ProductContextView from './views/ProductContextView';
import DraftsView from './views/DraftsView';
import IdeasView from './views/IdeasView';
import HomeView from './views/HomeView';

const MainContentViewRouter: FC<MainContentViewRouterProps> = (props) => {
  const { currentView } = props;

  if (currentView === 'clients') {
    return (
      <ClientsView
        clients={props.clients}
        selectedClientId={props.selectedClientId}
        onClientAdded={props.onClientAdded}
        onClientUpdated={props.onClientUpdated}
        onClientDeleted={props.onClientDeleted}
        onClientSelected={props.onClientSelected}
        onViewClientAssets={props.onViewClientAssets}
        onProductContextAdded={props.onProductContextAdded}
      />
    );
  }

  if (currentView === 'authors') {
    return (
      <AuthorsView
        selectedClientId={props.selectedClientId}
        filteredAuthors={props.filteredAuthors}
        onAuthorAdded={props.onAuthorAdded}
        onAuthorUpdated={props.onAuthorUpdated}
        onAuthorDeleted={props.onAuthorDeleted}
      />
    );
  }

  if (currentView === 'icp-scripts') {
    return (
      <ICPScriptsView
        filteredICPScripts={props.filteredICPScripts}
        selectedClientId={props.selectedClientId}
        onICPScriptAdded={props.onICPScriptAdded}
        onICPScriptUpdated={props.onICPScriptUpdated}
        onICPScriptDeleted={props.onICPScriptDeleted}
      />
    );
  }

  if (currentView === 'success-stories') {
    return (
      <SuccessStoriesView
        filteredSuccessStories={props.filteredSuccessStories}
        onSuccessStoryAdded={props.onSuccessStoryAdded}
        onSuccessStoryUpdated={props.onSuccessStoryUpdated}
        onSuccessStoryDeleted={props.onSuccessStoryDeleted}
      />
    );
  }

  if (currentView === 'product-context') {
    return (
      <ProductContextView
        selectedClientId={props.selectedClientId}
        currentProductContext={props.currentProductContext}
        onProductContextUpdated={props.onProductContextUpdated}
      />
    );
  }

  if (currentView === 'drafts') {
    return (
      <DraftsView
        selectedClientId={props.selectedClientId}
      />
    );
  }

  if (currentView === 'ideas') {
    return (
      <IdeasView
        filteredICPScripts={props.filteredICPScripts}
        currentProductContext={props.currentProductContext}
        ideas={props.ideas}
        selectedClientId={props.selectedClientId}
        onIdeaAdded={props.onIdeaAdded}
        onIdeaUpdated={props.onIdeaUpdated}
        onIdeaDeleted={props.onIdeaDeleted}
        onIdeaContentTypeSelect={props.onIdeaContentTypeSelect}
      />
    );
  }

  // Home view (default)
  return (
    <HomeView
      selectedType={props.selectedType}
      selectedArticleSubtype={props.selectedArticleSubtype}
      filteredICPScripts={props.filteredICPScripts}
      filteredSuccessStories={props.filteredSuccessStories}
      filteredAuthors={props.filteredAuthors}
      currentProductContext={props.currentProductContext}
      ideas={props.ideas}
      selectedClientId={props.selectedClientId}
      onContentTypeSelect={props.onContentTypeSelect}
      onArticleSubtypeSelect={props.onArticleSubtypeSelect}
      onBack={props.onBack}
      onSuccessStoryAdded={props.onSuccessStoryAdded}
      onNavigateToIdeasBank={props.onNavigateToIdeasBank}
    />
  );
};

export default MainContentViewRouter;

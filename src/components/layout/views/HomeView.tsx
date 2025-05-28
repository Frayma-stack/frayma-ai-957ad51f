
import { FC } from 'react';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface HomeViewProps extends Pick<MainContentViewRouterProps, 
  'selectedType' | 'selectedArticleSubtype' | 'filteredICPScripts' | 'filteredSuccessStories' | 
  'filteredAuthors' | 'currentProductContext' | 'ideas' | 'selectedClientId' | 
  'onContentTypeSelect' | 'onArticleSubtypeSelect' | 'onBack' | 'onSuccessStoryAdded' | 'onNavigateToIdeasBank'> {}

const HomeView: FC<HomeViewProps> = ({
  selectedType,
  selectedArticleSubtype,
  filteredICPScripts,
  filteredSuccessStories,
  filteredAuthors,
  currentProductContext,
  ideas,
  selectedClientId,
  onContentTypeSelect,
  onArticleSubtypeSelect,
  onBack,
  onSuccessStoryAdded,
  onNavigateToIdeasBank,
}) => {
  return (
    <div className="p-6">
      <HomeViewRouter
        selectedType={selectedType}
        selectedArticleSubtype={selectedArticleSubtype}
        filteredICPScripts={filteredICPScripts}
        filteredSuccessStories={filteredSuccessStories}
        filteredAuthors={filteredAuthors}
        currentProductContext={currentProductContext}
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

export default HomeView;

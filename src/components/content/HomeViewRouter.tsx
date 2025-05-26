
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import GTMNarrativeCreator from '@/components/GTMNarrativeCreator';
import SuccessStoryCreator from '@/components/SuccessStoryCreator';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface HomeViewRouterProps {
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  filteredICPScripts: ICPStoryScript[];
  filteredSuccessStories: CustomerSuccessStory[];
  filteredAuthors: Author[];
  currentProductContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
}

const HomeViewRouter: FC<HomeViewRouterProps> = ({
  selectedType,
  selectedArticleSubtype,
  filteredICPScripts,
  filteredSuccessStories,
  filteredAuthors,
  currentProductContext,
  ideas,
  onContentTypeSelect,
  onArticleSubtypeSelect,
  onBack,
  onSuccessStoryAdded,
}) => {
  if (selectedType === 'article' && !selectedArticleSubtype) {
    return (
      <ArticleTypeSelector 
        onSelect={onArticleSubtypeSelect}
        onBack={onBack}
      />
    );
  }
  
  if (selectedType === 'article' && selectedArticleSubtype) {
    return (
      <GTMNarrativeCreator
        articleSubType={selectedArticleSubtype}
        scripts={filteredICPScripts}
        successStories={filteredSuccessStories}
        ideas={ideas}
        onBack={onBack}
      />
    );
  }
  
  if (selectedType === 'success-story') {
    return (
      <SuccessStoryCreator 
        scripts={filteredICPScripts}
        successStories={filteredSuccessStories}
        authors={filteredAuthors}
        productContext={currentProductContext}
        onBack={onBack}
        onStoryCreated={onSuccessStoryAdded}
      />
    );
  }
  
  if (selectedType === 'linkedin') {
    return (
      <ShortFormContentCreator 
        contentType="linkedin"
        scripts={filteredICPScripts}
        authors={filteredAuthors}
        successStories={filteredSuccessStories}
        onBack={onBack}
      />
    );
  }
  
  if (selectedType === 'email') {
    return (
      <ShortFormContentCreator 
        contentType="email"
        scripts={filteredICPScripts}
        authors={filteredAuthors}
        successStories={filteredSuccessStories}
        onBack={onBack}
      />
    );
  }
  
  if (selectedType === 'custom') {
    return (
      <ShortFormContentCreator 
        contentType="custom"
        scripts={filteredICPScripts}
        authors={filteredAuthors}
        successStories={filteredSuccessStories}
        onBack={onBack}
      />
    );
  }
  
  return (
    <ContentTypeSelector 
      onSelect={onContentTypeSelect}
    />
  );
};

export default HomeViewRouter;

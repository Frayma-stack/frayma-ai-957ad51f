
import { FC, useState, useEffect } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import GTMNarrativeCreator from '@/components/GTMNarrativeCreator';
import SuccessStoryCreator from '@/components/SuccessStoryCreator';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ScrollArea } from "@/components/ui/scroll-area";

interface HomeViewRouterProps {
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  filteredICPScripts: ICPStoryScript[];
  filteredSuccessStories: CustomerSuccessStory[];
  filteredAuthors: Author[];
  currentProductContext: ProductContext | null;
  ideas: GeneratedIdea[];
  selectedClientId?: string | null;
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
  onNavigateToIdeasBank?: () => void;
}

const HomeViewRouter: FC<HomeViewRouterProps> = ({
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
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Listen for the custom event to navigate to ideas bank
  useEffect(() => {
    const handleNavigateToIdeasBank = () => {
      if (onNavigateToIdeasBank) {
        onNavigateToIdeasBank();
      }
    };

    window.addEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank);
    
    return () => {
      window.removeEventListener('navigate-to-ideas-bank', handleNavigateToIdeasBank);
    };
  }, [onNavigateToIdeasBank]);

  if (selectedType === 'article' && !selectedArticleSubtype) {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ArticleTypeSelector 
          onSelect={onArticleSubtypeSelect}
          onBack={onBack}
          ideas={ideas}
          selectedClientId={selectedClientId}
          selectedIdeaId={selectedIdeaId}
          onIdeaSelect={setSelectedIdeaId}
        />
      </ScrollArea>
    );
  }
  
  if (selectedType === 'article' && selectedArticleSubtype) {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <GTMNarrativeCreator
          articleSubType={selectedArticleSubtype}
          scripts={filteredICPScripts}
          successStories={filteredSuccessStories}
          ideas={ideas}
          selectedIdeaId={selectedIdeaId}
          onBack={onBack}
        />
      </ScrollArea>
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
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ShortFormContentCreator 
          contentType="linkedin"
          scripts={filteredICPScripts}
          authors={filteredAuthors}
          successStories={filteredSuccessStories}
          ideas={ideas}
          selectedClientId={selectedClientId}
          onBack={onBack}
        />
      </ScrollArea>
    );
  }
  
  if (selectedType === 'email') {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ShortFormContentCreator 
          contentType="email"
          scripts={filteredICPScripts}
          authors={filteredAuthors}
          successStories={filteredSuccessStories}
          ideas={ideas}
          selectedClientId={selectedClientId}
          onBack={onBack}
        />
      </ScrollArea>
    );
  }
  
  if (selectedType === 'custom') {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ShortFormContentCreator 
          contentType="custom"
          scripts={filteredICPScripts}
          authors={filteredAuthors}
          successStories={filteredSuccessStories}
          ideas={ideas}
          selectedClientId={selectedClientId}
          onBack={onBack}
        />
      </ScrollArea>
    );
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <ContentTypeSelector 
        onSelect={onContentTypeSelect}
        ideas={ideas}
        selectedClientId={selectedClientId}
        selectedIdeaId={selectedIdeaId}
        onIdeaSelect={setSelectedIdeaId}
      />
    </ScrollArea>
  );
};

export default HomeViewRouter;

import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import StoryBriefManager from '@/components/StoryBriefManager';
import SuccessStoryCreator from '@/components/SuccessStoryCreator';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import { Client, Author, StoryBrief, ICPStoryScript } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface MainContentProps {
  currentView: string;
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedClientId: string | null;
  clients: Client[];
  authors: Author[];
  ideas: GeneratedIdea[];
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
}

const MainContent: FC<MainContentProps> = ({
  currentView,
  selectedType,
  selectedArticleSubtype,
  selectedClientId,
  clients,
  authors,
  ideas,
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
}) => {
  const getFilteredAuthors = () => {
    if (selectedClientId) {
      return authors.filter(author => author.clientId === selectedClientId);
    }
    return authors;
  };

  // Mock data for Story Briefs and ICP Scripts - in a real app these would come from props or storage
  const mockStoryBriefs: StoryBrief[] = [];
  const mockICPScripts: ICPStoryScript[] = [];
  const mockSuccessStories = [];

  const handleStoryBriefAdded = (brief: StoryBrief) => {
    console.log('Story brief added:', brief);
    // TODO: Implement story brief storage
  };

  const handleStoryBriefUpdated = (brief: StoryBrief) => {
    console.log('Story brief updated:', brief);
    // TODO: Implement story brief storage
  };

  const handleStoryBriefDeleted = (briefId: string) => {
    console.log('Story brief deleted:', briefId);
    // TODO: Implement story brief storage
  };

  const handleStoryBriefSelected = (brief: StoryBrief) => {
    console.log('Story brief selected:', brief);
    // TODO: Navigate to content generation with selected brief
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
        <StoryBriefManager
          briefs={mockStoryBriefs}
          scripts={mockICPScripts}
          onBriefAdded={handleStoryBriefAdded}
          onBriefUpdated={handleStoryBriefUpdated}
          onBriefDeleted={handleStoryBriefDeleted}
          onBriefSelected={handleStoryBriefSelected}
          articleSubType={selectedArticleSubtype}
        />
      );
    } else if (selectedType === 'success-story') {
      return (
        <SuccessStoryCreator 
          onBack={onBack}
        />
      );
    } else if (selectedType === 'linkedin') {
      return (
        <ShortFormContentCreator 
          contentType="linkedin"
          scripts={mockICPScripts}
          authors={getFilteredAuthors()}
          successStories={mockSuccessStories}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'email') {
      return (
        <ShortFormContentCreator 
          contentType="email"
          scripts={mockICPScripts}
          authors={getFilteredAuthors()}
          successStories={mockSuccessStories}
          onBack={onBack}
        />
      );
    } else if (selectedType === 'custom') {
      return (
        <ShortFormContentCreator 
          contentType="custom"
          scripts={mockICPScripts}
          authors={getFilteredAuthors()}
          successStories={mockSuccessStories}
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
        scripts={mockICPScripts}
        productContext={{}}
        ideas={ideas}
        onIdeaAdded={onIdeaAdded}
        onIdeaUpdated={onIdeaUpdated}
        onIdeaDeleted={onIdeaDeleted}
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

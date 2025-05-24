
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import ClientManager from '@/components/ClientManager';
import AuthorManager from '@/components/AuthorManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import { Client, Author } from '@/types/storytelling';
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

  if (currentView === 'home') {
    if (selectedType === 'article' && !selectedArticleSubtype) {
      return (
        <ArticleTypeSelector 
          onSelect={onArticleSubtypeSelect}
          onBack={onBack}
        />
      );
    } else if (selectedType && selectedType !== 'generate-ideas') {
      // Show content creation flow for selected type
      return (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {selectedType === 'article' && selectedArticleSubtype ? 
              `Creating ${selectedArticleSubtype === 'newsletter' ? 'Newsletter' : 'Thought Leadership Article'}` :
              `Creating ${selectedType}`}
          </h2>
          <p className="text-gray-500">Content creation flow coming soon...</p>
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
          >
            Back
          </button>
        </div>
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
        scripts={[]} // TODO: Load actual scripts
        productContext={{}} // TODO: Load actual product context
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

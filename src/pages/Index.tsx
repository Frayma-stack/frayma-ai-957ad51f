import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import ContentTypeSelector, { ContentType, ArticleSubType } from "@/components/ContentTypeSelector";
import ArticleTypeSelector from "@/components/ArticleTypeSelector";
import ClientManager from "@/components/ClientManager";
import AuthorManager from "@/components/AuthorManager";
import IdeasBank from "@/components/ideas/IdeasBank";
import { useAuth } from "@/contexts/AuthContext";
import { Client, Author } from "@/types/storytelling";
import { GeneratedIdea } from "@/types/ideas";

const Index = () => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Load data from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }

    const savedAuthors = localStorage.getItem('authors');
    if (savedAuthors) {
      setAuthors(JSON.parse(savedAuthors));
    }

    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    
    if (type === 'article') {
      // Show article sub-type selector - don't navigate yet
      return;
    }
    
    if (type === 'generate-ideas') {
      // Navigate to ideas generation
      setCurrentView('ideas');
      return;
    }
    
    // For other content types, we can add specific handling here
    console.log('Selected content type:', type);
    // TODO: Add navigation logic for other content types
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
    console.log('Selected article subtype:', subtype);
    // TODO: Navigate to article creation flow
  };

  const handleBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedType) {
      setSelectedType(null);
    } else {
      setCurrentView('home');
    }
  };

  const handleAssetTypeChange = (type: string) => {
    setCurrentView(type);
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleClientAdded = (client: Client) => {
    const updatedClients = [...clients, client];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleClientUpdated = (updatedClient: Client) => {
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleClientDeleted = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    setSelectedClientId(clientId);
    setCurrentView(assetType);
  };

  const handleAuthorAdded = (author: Author) => {
    const updatedAuthors = [...authors, author];
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleAuthorUpdated = (updatedAuthor: Author) => {
    const updatedAuthors = authors.map(author => 
      author.id === updatedAuthor.id ? updatedAuthor : author
    );
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleAuthorDeleted = (authorId: string) => {
    const updatedAuthors = authors.filter(author => author.id !== authorId);
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleIdeaAdded = (idea: GeneratedIdea) => {
    const updatedIdeas = [...ideas, idea];
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const handleIdeaUpdated = (updatedIdea: GeneratedIdea) => {
    const updatedIdeas = ideas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    );
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const handleIdeaDeleted = (ideaId: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== ideaId);
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const getFilteredAuthors = () => {
    if (selectedClientId) {
      return authors.filter(author => author.clientId === selectedClientId);
    }
    return authors;
  };

  const renderMainContent = () => {
    if (currentView === 'home') {
      if (selectedType === 'article' && !selectedArticleSubtype) {
        return (
          <ArticleTypeSelector 
            onSelect={handleArticleSubtypeSelect}
            onBack={handleBack}
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
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
            >
              Back
            </button>
          </div>
        );
      } else {
        return (
          <ContentTypeSelector 
            onSelect={handleContentTypeSelect}
          />
        );
      }
    }

    if (currentView === 'clients') {
      return (
        <ClientManager
          clients={clients}
          selectedClientId={selectedClientId}
          onClientAdded={handleClientAdded}
          onClientUpdated={handleClientUpdated}
          onClientDeleted={handleClientDeleted}
          onClientSelected={handleClientSelected}
          onViewClientAssets={handleViewClientAssets}
        />
      );
    }

    if (currentView === 'authors') {
      return (
        <AuthorManager
          authors={getFilteredAuthors()}
          onAuthorAdded={handleAuthorAdded}
          onAuthorUpdated={handleAuthorUpdated}
          onAuthorDeleted={handleAuthorDeleted}
        />
      );
    }

    if (currentView === 'ideas') {
      return (
        <IdeasBank
          scripts={[]} // TODO: Load actual scripts
          productContext={{}} // TODO: Load actual product context
          ideas={ideas}
          onIdeaAdded={handleIdeaAdded}
          onIdeaUpdated={handleIdeaUpdated}
          onIdeaDeleted={handleIdeaDeleted}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="flex">
        <Sidebar
          ideas={ideas}
          selectedClientId={selectedClientId}
          clients={clients}
          onAssetTypeChange={handleAssetTypeChange}
          onClientSelected={handleClientSelected}
          onIdeasBankSelected={handleIdeasBankSelected}
          onHomeSelected={handleHomeSelected}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

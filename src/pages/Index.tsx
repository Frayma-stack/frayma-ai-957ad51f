
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import ContentTypeSelector, { ContentType, ArticleSubType } from "@/components/ContentTypeSelector";
import ArticleTypeSelector from "@/components/ArticleTypeSelector";
import ClientManager from "@/components/ClientManager";
import AuthorManager from "@/components/AuthorManager";
import { useAuth } from "@/contexts/AuthContext";
import { Client, Author } from "@/types/storytelling";

const Index = () => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  
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
      // Show article sub-type selector
      return;
    }
    // Handle other content types here
    console.log('Selected content type:', type);
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
    console.log('Selected article subtype:', subtype);
  };

  const handleBack = () => {
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  const handleAssetTypeChange = (type: string) => {
    setCurrentView(type);
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
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
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-700">Ideas Bank</h2>
          <p className="text-gray-500 mt-2">Your saved ideas will appear here</p>
        </div>
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

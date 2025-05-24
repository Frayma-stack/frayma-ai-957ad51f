
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Sidebar from '@/components/Sidebar';
import ContentTypeSelector, { ArticleSubType, ContentType } from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import SuccessStoryCreator from '@/components/SuccessStoryCreator';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import StoryBriefManager from '@/components/StoryBriefManager';
import EnhancedStoryPreview from '@/components/EnhancedStoryPreview';
import AuthorManager from '@/components/AuthorManager';
import ProductContextManager from '@/components/ProductContextManager';
import ClientManager from '@/components/ClientManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import { ICPStoryScript, StoryBrief, Author, ProductContext, Client, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

const Index = () => {
  const [scripts, setScripts] = useState<ICPStoryScript[]>([]);
  const [briefs, setBriefs] = useState<StoryBrief[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [productContext, setProductContext] = useState<ProductContext | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedBrief, setSelectedBrief] = useState<StoryBrief | null>(null);
  const [activeTab, setActiveTab] = useState<string>('create');
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [articleSubType, setArticleSubType] = useState<ArticleSubType | null>(null);
  const [assetType, setAssetType] = useState<string>('clients');
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [showIdeasBank, setShowIdeasBank] = useState<boolean>(false);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedScripts = localStorage.getItem('icpScripts');
    const savedBriefs = localStorage.getItem('storyBriefs');
    const savedAuthors = localStorage.getItem('authors');
    const savedProductContext = localStorage.getItem('productContext');
    const savedClients = localStorage.getItem('clients');
    const savedSelectedClientId = localStorage.getItem('selectedClientId');
    const savedSuccessStories = localStorage.getItem('successStories');
    const savedIdeas = localStorage.getItem('ideas');
    
    if (savedScripts) setScripts(JSON.parse(savedScripts));
    if (savedBriefs) setBriefs(JSON.parse(savedBriefs));
    if (savedAuthors) setAuthors(JSON.parse(savedAuthors));
    if (savedProductContext) setProductContext(JSON.parse(savedProductContext));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedSelectedClientId) setSelectedClientId(JSON.parse(savedSelectedClientId));
    if (savedSuccessStories) setSuccessStories(JSON.parse(savedSuccessStories));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('icpScripts', JSON.stringify(scripts));
  }, [scripts]);
  
  useEffect(() => {
    localStorage.setItem('storyBriefs', JSON.stringify(briefs));
  }, [briefs]);
  
  useEffect(() => {
    localStorage.setItem('authors', JSON.stringify(authors));
  }, [authors]);
  
  useEffect(() => {
    if (productContext) {
      localStorage.setItem('productContext', JSON.stringify(productContext));
    }
  }, [productContext]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('selectedClientId', JSON.stringify(selectedClientId));
  }, [selectedClientId]);

  useEffect(() => {
    localStorage.setItem('successStories', JSON.stringify(successStories));
  }, [successStories]);

  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  // Filter assets based on selected client
  const filteredScripts = selectedClientId 
    ? scripts.filter(script => script.clientId === selectedClientId)
    : scripts;
  
  const filteredBriefs = selectedClientId
    ? briefs.filter(brief => brief.clientId === selectedClientId)
    : briefs;
  
  const filteredAuthors = selectedClientId
    ? authors.filter(author => author.clientId === selectedClientId)
    : authors;
    
  const filteredSuccessStories = selectedClientId
    ? successStories.filter(story => story.clientId === selectedClientId)
    : successStories;

  // Handle Client operations
  const handleClientAdded = (client: Client) => {
    setClients([...clients, client]);
  };
  
  const handleClientUpdated = (updatedClient: Client) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
  };
  
  const handleClientDeleted = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  // Handle Idea operations
  const handleIdeaAdded = (idea: GeneratedIdea) => {
    setIdeas([...ideas, idea]);
  };
  
  const handleIdeaUpdated = (updatedIdea: GeneratedIdea) => {
    setIdeas(ideas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    ));
  };
  
  const handleIdeaDeleted = (ideaId: string) => {
    setIdeas(ideas.filter(idea => idea.id !== ideaId));
  };

  // Handle ICP StoryScript operations
  const handleScriptAdded = (script: ICPStoryScript) => {
    const scriptWithClient = {
      ...script,
      clientId: selectedClientId || undefined
    };
    setScripts([...scripts, scriptWithClient]);
  };
  
  const handleScriptUpdated = (updatedScript: ICPStoryScript) => {
    setScripts(scripts.map(script => 
      script.id === updatedScript.id ? updatedScript : script
    ));
  };
  
  const handleScriptDeleted = (scriptId: string) => {
    setScripts(scripts.filter(script => script.id !== scriptId));
  };
  
  // Handle Success Story operations
  const handleSuccessStoryAdded = (story: CustomerSuccessStory) => {
    const storyWithClient = {
      ...story,
      clientId: selectedClientId || undefined
    };
    setSuccessStories([...successStories, storyWithClient]);
  };
  
  const handleSuccessStoryUpdated = (updatedStory: CustomerSuccessStory) => {
    setSuccessStories(successStories.map(story => 
      story.id === updatedStory.id ? updatedStory : story
    ));
  };
  
  const handleSuccessStoryDeleted = (storyId: string) => {
    setSuccessStories(successStories.filter(story => story.id !== storyId));
  };
  
  // Handle Author operations
  const handleAuthorAdded = (author: Author) => {
    const authorWithClient = {
      ...author,
      clientId: selectedClientId || undefined
    };
    setAuthors([...authors, authorWithClient]);
  };
  
  const handleAuthorUpdated = (updatedAuthor: Author) => {
    setAuthors(authors.map(author => 
      author.id === updatedAuthor.id ? updatedAuthor : author
    ));
  };
  
  const handleAuthorDeleted = (authorId: string) => {
    setAuthors(authors.filter(author => author.id !== authorId));
  };
  
  // Handle Product Context operations
  const handleProductContextUpdated = (updatedContext: ProductContext) => {
    const contextWithClient = {
      ...updatedContext,
      clientId: selectedClientId || undefined
    };
    setProductContext(contextWithClient);
  };
  
  // Handle StoryBrief operations
  const handleBriefAdded = (brief: StoryBrief) => {
    const briefWithClient = {
      ...brief,
      clientId: selectedClientId || undefined
    };
    setBriefs([...briefs, briefWithClient]);
  };
  
  const handleBriefUpdated = (updatedBrief: StoryBrief) => {
    setBriefs(briefs.map(brief => 
      brief.id === updatedBrief.id ? updatedBrief : brief
    ));
  };
  
  const handleBriefDeleted = (briefId: string) => {
    setBriefs(briefs.filter(brief => brief.id !== briefId));
  };
  
  const handleBriefSelected = (brief: StoryBrief) => {
    setSelectedBrief(brief);
    setActiveTab('preview');
  };

  // Handle Content Type selection
  const handleContentTypeSelect = (type: ContentType) => {
    console.log("Content type selected:", type);
    setContentType(type);
    
    // If the user selects "generate-ideas", show the IdeasBank
    if (type === 'generate-ideas') {
      setShowIdeasBank(true);
      setActiveTab('ideasBank');
      return;
    }
    
    // Reset article subtype when changing content type
    setArticleSubType(null);
    
    // Handle different content types
    if (type === 'article') {
      // Do nothing here, wait for subtype selection
      console.log("Waiting for article subtype selection");
    } else if (type === 'success-story') {
      // Go directly to success story creator
      setActiveTab('create');
    } else if (type === 'email' || type === 'linkedin' || type === 'custom') {
      // For non-article types, skip briefs and go directly to content creator
      setActiveTab('create');
    }
  };

  const handleArticleSubTypeSelect = (subtype: ArticleSubType) => {
    console.log("Article subtype selected:", subtype);
    setArticleSubType(subtype);
    setActiveTab('briefs');
  };
  
  const resetContentTypeSelection = () => {
    console.log("Resetting content type selection");
    setContentType(null);
    setArticleSubType(null);
  };

  const handleAssetTypeChange = (type: string) => {
    setAssetType(type);
    setActiveTab('assets');
    setShowIdeasBank(false);
  };
  
  const handleIdeasBankSelected = () => {
    setShowIdeasBank(true);
    setActiveTab('ideasBank');
  };
  
  const handleHomeSelected = () => {
    setActiveTab('create');
    setContentType(null);
    setArticleSubType(null);
    setShowIdeasBank(false);
  };

  const renderMainContent = () => {
    console.log("Rendering main content with:", { activeTab, contentType, articleSubType, showIdeasBank });
    
    // If showing Ideas Bank
    if (showIdeasBank) {
      return (
        <IdeasBank
          scripts={filteredScripts}
          productContext={productContext}
          ideas={ideas}
          onIdeaAdded={handleIdeaAdded}
          onIdeaUpdated={handleIdeaUpdated}
          onIdeaDeleted={handleIdeaDeleted}
        />
      );
    }
    
    // If showing assets
    if (activeTab === 'assets') {
      switch (assetType) {
        case 'clients':
          return (
            <ClientManager
              clients={clients}
              selectedClientId={selectedClientId}
              onClientAdded={handleClientAdded}
              onClientUpdated={handleClientUpdated}
              onClientDeleted={handleClientDeleted}
              onClientSelected={handleClientSelected}
              onViewClientAssets={(clientId, type) => {
                setSelectedClientId(clientId);
                setAssetType(type);
              }}
            />
          );
        case 'authors':
          return (
            <AuthorManager 
              authors={filteredAuthors}
              onAuthorAdded={handleAuthorAdded}
              onAuthorUpdated={handleAuthorUpdated}
              onAuthorDeleted={handleAuthorDeleted}
            />
          );
        case 'icps':
          return (
            <ICPStoryScriptManager 
              scripts={filteredScripts}
              onScriptAdded={handleScriptAdded}
              onScriptUpdated={handleScriptUpdated}
              onScriptDeleted={handleScriptDeleted}
            />
          );
        case 'successStories':
          return (
            <CustomerSuccessManager 
              successStories={filteredSuccessStories}
              onSuccessStoryAdded={handleSuccessStoryAdded}
              onSuccessStoryUpdated={handleSuccessStoryUpdated}
              onSuccessStoryDeleted={handleSuccessStoryDeleted}
            />
          );
        case 'productContext':
          return (
            <ProductContextManager 
              productContext={selectedClientId ? 
                (productContext?.clientId === selectedClientId ? productContext : null) : 
                productContext}
              onProductContextUpdated={handleProductContextUpdated}
            />
          );
        default:
          return null;
      }
    }
    
    // If showing content creation
    if (activeTab === 'create' || !activeTab) {
      if (!contentType) {
        return <ContentTypeSelector onSelect={handleContentTypeSelect} />;
      } else if (contentType === 'success-story') {
        return (
          <SuccessStoryCreator 
            onBack={resetContentTypeSelection}
          />
        );
      } else if (contentType === 'article' && !articleSubType) {
        return (
          <ArticleTypeSelector 
            onSelect={handleArticleSubTypeSelect} 
            onBack={resetContentTypeSelection}
          />
        );
      } else if (contentType === 'article' && articleSubType) {
        return (
          <div>
            <StoryBriefManager 
              briefs={filteredBriefs}
              scripts={filteredScripts}
              onBriefAdded={handleBriefAdded}
              onBriefUpdated={handleBriefUpdated}
              onBriefDeleted={handleBriefDeleted}
              onBriefSelected={handleBriefSelected}
              articleSubType={articleSubType}
            />
          </div>
        );
      } else if (contentType === 'email' || contentType === 'linkedin' || contentType === 'custom') {
        return (
          <ShortFormContentCreator 
            contentType={contentType}
            scripts={filteredScripts}
            authors={filteredAuthors}
            successStories={filteredSuccessStories}
            onBack={resetContentTypeSelection}
          />
        );
      }
    }
    
    // If showing preview
    if (activeTab === 'preview') {
      return (
        <EnhancedStoryPreview 
          selectedBrief={selectedBrief} 
          scripts={scripts}
          authors={authors}
          productContext={productContext}
        />
      );
    }
    
    // Default fallback - show the content selector
    return <ContentTypeSelector onSelect={handleContentTypeSelect} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <NavBar />
      
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar 
          ideas={ideas}
          selectedClientId={selectedClientId}
          clients={clients}
          onAssetTypeChange={handleAssetTypeChange}
          onClientSelected={handleClientSelected}
          onIdeasBankSelected={handleIdeasBankSelected}
          onHomeSelected={handleHomeSelected}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {renderMainContent()}
          
          {/* Content Type Navigation Buttons */}
          {(contentType === 'article' || articleSubType) && activeTab === 'create' && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={resetContentTypeSelection}
                className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 transition-colors mt-4"
              >
                Back to Content Types
              </button>
            </div>
          )}
          
          {/* Preview Navigation */}
          {activeTab === 'preview' && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setActiveTab('create')}
                className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 transition-colors"
              >
                Back to Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

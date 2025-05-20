import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import StoryBriefManager from '@/components/StoryBriefManager';
import EnhancedStoryPreview from '@/components/EnhancedStoryPreview';
import ContentTypeSelector, { ArticleSubType } from '@/components/ContentTypeSelector';
import ArticleTypeSelector from '@/components/ArticleTypeSelector';
import ShortFormContentCreator from '@/components/ShortFormContentCreator';
import AuthorManager from '@/components/AuthorManager';
import ProductContextManager from '@/components/ProductContextManager';
import ClientManager from '@/components/ClientManager';
import CustomerSuccessManager from '@/components/CustomerSuccessManager';
import IdeasBank from '@/components/ideas/IdeasBank';
import { Button } from '@/components/ui/button';
import { Book, BookMarked, FileText, Package, Target, Trophy, User, Users, Lightbulb } from 'lucide-react';
import { ICPStoryScript, StoryBrief, Author, ProductContext, Client, CustomerSuccessStory } from '@/types/storytelling';
import { ContentType } from '@/components/ContentTypeSelector';
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

  const handleViewClientAssets = (clientId: string, type: string) => {
    setSelectedClientId(clientId);
    setActiveTab('assets');
    setAssetType(type);
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
    
    // Also update any briefs that reference this script
    if (selectedBrief && selectedBrief.targetAudience === updatedScript.id) {
      setSelectedBrief({ ...selectedBrief });
    }
  };
  
  const handleScriptDeleted = (scriptId: string) => {
    setScripts(scripts.filter(script => script.id !== scriptId));
    
    // If any briefs reference this script, update them
    const affectedBriefs = briefs.filter(brief => brief.targetAudience === scriptId);
    if (affectedBriefs.length > 0) {
      // You might want to handle this situation differently
      // This approach just removes the targetAudience reference
      const updatedBriefs = briefs.map(brief => 
        brief.targetAudience === scriptId 
          ? { ...brief, targetAudience: '' } 
          : brief
      );
      setBriefs(updatedBriefs);
    }
    
    // If selected brief references this script, deselect it
    if (selectedBrief && selectedBrief.targetAudience === scriptId) {
      setSelectedBrief(null);
    }
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
    
    // If this is the currently selected brief, update that reference too
    if (selectedBrief && selectedBrief.id === updatedBrief.id) {
      setSelectedBrief(updatedBrief);
    }
  };
  
  const handleBriefDeleted = (briefId: string) => {
    setBriefs(briefs.filter(brief => brief.id !== briefId));
    
    // If this is the currently selected brief, deselect it
    if (selectedBrief && selectedBrief.id === briefId) {
      setSelectedBrief(null);
    }
  };
  
  const handleBriefSelected = (brief: StoryBrief) => {
    setSelectedBrief(brief);
    setActiveTab('preview');
  };

  const handleContentTypeSelect = (type: ContentType) => {
    setContentType(type);
    
    // Reset article subtype when changing content type
    setArticleSubType(null);
    
    // If article type, we need to select the subtype
    if (type !== 'article') {
      setActiveTab('briefs');
    }
  };

  const handleArticleSubTypeSelect = (subtype: ArticleSubType) => {
    setArticleSubType(subtype);
    setActiveTab('briefs');
  };
  
  const resetContentTypeSelection = () => {
    setContentType(null);
    setArticleSubType(null);
  };

  const clientInfo = selectedClientId 
    ? clients.find(client => client.id === selectedClientId)
    : null;
  
  return (
    <div className="min-h-screen flex flex-col bg-story-cream">
      <NavBar />
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-story-blue mb-2">Frayma</h1>
          <p className="text-xl text-gray-700 mb-4">Product-Led Storytelling Framework</p>
          <div className="inline-flex items-center bg-story-sand/50 p-3 rounded-md text-gray-700">
            <Book className="h-5 w-5 mr-2 text-story-blue" />
            <p>First define your ICPs and Authors, then create content that resonates with your target audience</p>
          </div>
          {selectedClientId && (
            <div className="mt-3 inline-flex items-center bg-story-blue/10 px-4 py-2 rounded-full">
              <Users className="h-5 w-5 mr-2 text-story-blue" />
              <span className="font-medium">Currently working with: {clientInfo?.name}</span>
              {selectedClientId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-story-blue hover:bg-story-blue/20"
                  onClick={() => setSelectedClientId(null)}
                >
                  Clear Selection
                </Button>
              )}
            </div>
          )}
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="ideasBank">
                <Lightbulb className="h-4 w-4 mr-2" />
                Ideas Bank
              </TabsTrigger>
              <TabsTrigger value="create">Create Content</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ideasBank" className="space-y-6">
            <IdeasBank
              scripts={filteredScripts}
              productContext={productContext}
              ideas={ideas}
              onIdeaAdded={handleIdeaAdded}
              onIdeaUpdated={handleIdeaUpdated}
              onIdeaDeleted={handleIdeaDeleted}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {!contentType ? (
              <ContentTypeSelector onSelect={handleContentTypeSelect} />
            ) : contentType === 'article' && !articleSubType ? (
              <ArticleTypeSelector 
                onSelect={handleArticleSubTypeSelect} 
                onBack={resetContentTypeSelection}
              />
            ) : contentType === 'article' || articleSubType ? (
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
                {filteredBriefs.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <Button onClick={() => setActiveTab('preview')} className="bg-story-blue hover:bg-story-light-blue">
                      Preview Selected Story
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <ShortFormContentCreator 
                contentType={contentType as 'email' | 'linkedin' | 'custom'}
                scripts={filteredScripts}
                authors={filteredAuthors}
                successStories={filteredSuccessStories}
                onBack={resetContentTypeSelection}
              />
            )}
            
            {(contentType === 'article' || articleSubType) && (
              <div className="flex justify-center mt-4">
                <Button onClick={resetContentTypeSelection} className="bg-story-blue hover:bg-story-light-blue">
                  Back to Content Types
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview">
            <EnhancedStoryPreview 
              selectedBrief={selectedBrief} 
              scripts={scripts}
              authors={authors}
              productContext={productContext}
            />
            
            {!selectedBrief && briefs.length > 0 && (
              <div className="text-center mt-4 text-gray-600">
                <p>Select a Story Brief from the Story Briefs tab to preview and edit your narrative</p>
              </div>
            )}
            
            <div className="flex justify-center mt-6">
              <Button onClick={() => setActiveTab('create')} className="bg-story-blue hover:bg-story-light-blue">
                Back to Content
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button 
                variant={assetType === 'clients' ? 'default' : 'outline'} 
                onClick={() => setAssetType('clients')}
                className={assetType === 'clients' ? 'bg-story-blue hover:bg-story-light-blue' : ''}
              >
                <Users className="h-4 w-4 mr-2" />
                Clients
              </Button>
              <Button 
                variant={assetType === 'authors' ? 'default' : 'outline'} 
                onClick={() => setAssetType('authors')}
                className={assetType === 'authors' ? 'bg-story-blue hover:bg-story-light-blue' : ''}
              >
                <User className="h-4 w-4 mr-2" />
                Authors
              </Button>
              <Button 
                variant={assetType === 'icps' ? 'default' : 'outline'} 
                onClick={() => setAssetType('icps')}
                className={assetType === 'icps' ? 'bg-story-blue hover:bg-story-light-blue' : ''}
              >
                <Target className="h-4 w-4 mr-2" />
                ICPs
              </Button>
              <Button 
                variant={assetType === 'successStories' ? 'default' : 'outline'} 
                onClick={() => setAssetType('successStories')}
                className={assetType === 'successStories' ? 'bg-story-blue hover:bg-story-light-blue' : ''}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Success Stories
              </Button>
              <Button 
                variant={assetType === 'productContext' ? 'default' : 'outline'} 
                onClick={() => setAssetType('productContext')}
                className={assetType === 'productContext' ? 'bg-story-blue hover:bg-story-light-blue' : ''}
              >
                <Package className="h-4 w-4 mr-2" />
                Product Context
              </Button>
            </div>
            
            {assetType === 'clients' && (
              <ClientManager
                clients={clients}
                selectedClientId={selectedClientId}
                onClientAdded={handleClientAdded}
                onClientUpdated={handleClientUpdated}
                onClientDeleted={handleClientDeleted}
                onClientSelected={handleClientSelected}
                onViewClientAssets={handleViewClientAssets}
              />
            )}
            
            {assetType === 'authors' && (
              <AuthorManager 
                authors={filteredAuthors}
                onAuthorAdded={handleAuthorAdded}
                onAuthorUpdated={handleAuthorUpdated}
                onAuthorDeleted={handleAuthorDeleted}
              />
            )}
            
            {assetType === 'icps' && (
              <ICPStoryScriptManager 
                scripts={filteredScripts}
                onScriptAdded={handleScriptAdded}
                onScriptUpdated={handleScriptUpdated}
                onScriptDeleted={handleScriptDeleted}
              />
            )}
            
            {assetType === 'successStories' && (
              <CustomerSuccessManager 
                successStories={filteredSuccessStories}
                onSuccessStoryAdded={handleSuccessStoryAdded}
                onSuccessStoryUpdated={handleSuccessStoryUpdated}
                onSuccessStoryDeleted={handleSuccessStoryDeleted}
              />
            )}
            
            {assetType === 'productContext' && (
              <ProductContextManager 
                productContext={selectedClientId ? 
                  (productContext?.clientId === selectedClientId ? productContext : null) : 
                  productContext}
                onProductContextUpdated={handleProductContextUpdated}
              />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8 mb-8">
          <p className="text-gray-500 text-sm">Frayma helps you create authentic, resonant stories that sell without feeling like sales</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

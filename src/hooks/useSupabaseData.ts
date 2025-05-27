
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseDataService } from '@/services/supabaseDataService';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { toast } from 'sonner';

export const useSupabaseData = () => {
  const { user } = useAuth();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [icpScripts, setICPScripts] = useState<ICPStoryScript[]>([]);
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all data when user is available
  const loadAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [
        clientsData,
        authorsData,
        ideasData,
        icpScriptsData,
        successStoriesData,
        productContextsData
      ] = await Promise.all([
        supabaseDataService.getClients(),
        supabaseDataService.getAuthors(),
        supabaseDataService.getIdeas(),
        supabaseDataService.getICPScripts(),
        supabaseDataService.getSuccessStories(),
        supabaseDataService.getProductContexts()
      ]);

      setClients(clientsData);
      setAuthors(authorsData);
      setIdeas(ideasData);
      setICPScripts(icpScriptsData);
      setSuccessStories(successStoriesData);
      setProductContexts(productContextsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setClients([]);
      setAuthors([]);
      setIdeas([]);
      setICPScripts([]);
      setSuccessStories([]);
      setProductContexts([]);
    }
  }, [user]);

  // Client handlers
  const handleClientAdded = async (client: Client) => {
    try {
      const newClient = await supabaseDataService.createClient(client);
      setClients(prev => [newClient, ...prev]);
      toast.success('Client created successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
    }
  };

  const handleClientUpdated = async (updatedClient: Client) => {
    try {
      const client = await supabaseDataService.updateClient(updatedClient);
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  };

  const handleClientDeleted = async (clientId: string) => {
    try {
      await supabaseDataService.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  // Author handlers
  const handleAuthorAdded = async (author: Author) => {
    try {
      const newAuthor = await supabaseDataService.createAuthor(author);
      setAuthors(prev => [newAuthor, ...prev]);
      toast.success('Author created successfully');
    } catch (error) {
      console.error('Error creating author:', error);
      toast.error('Failed to create author');
    }
  };

  const handleAuthorUpdated = async (updatedAuthor: Author) => {
    try {
      const author = await supabaseDataService.updateAuthor(updatedAuthor);
      setAuthors(prev => prev.map(a => a.id === author.id ? author : a));
      toast.success('Author updated successfully');
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Failed to update author');
    }
  };

  const handleAuthorDeleted = async (authorId: string) => {
    try {
      await supabaseDataService.deleteAuthor(authorId);
      setAuthors(prev => prev.filter(author => author.id !== authorId));
      toast.success('Author deleted successfully');
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Failed to delete author');
    }
  };

  // Idea handlers
  const handleIdeaAdded = async (idea: GeneratedIdea) => {
    try {
      const newIdea = await supabaseDataService.createIdea(idea);
      setIdeas(prev => [newIdea, ...prev]);
      toast.success('Idea saved successfully');
    } catch (error) {
      console.error('Error creating idea:', error);
      toast.error('Failed to save idea');
    }
  };

  const handleIdeaUpdated = async (updatedIdea: GeneratedIdea) => {
    try {
      const idea = await supabaseDataService.updateIdea(updatedIdea);
      setIdeas(prev => prev.map(i => i.id === idea.id ? idea : i));
      toast.success('Idea updated successfully');
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
    }
  };

  const handleIdeaDeleted = async (ideaId: string) => {
    try {
      await supabaseDataService.deleteIdea(ideaId);
      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast.success('Idea deleted successfully');
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
    }
  };

  // ICP Script handlers
  const handleICPScriptAdded = async (script: ICPStoryScript) => {
    try {
      const newScript = await supabaseDataService.createICPScript(script);
      setICPScripts(prev => [newScript, ...prev]);
      toast.success('ICP script created successfully');
    } catch (error) {
      console.error('Error creating ICP script:', error);
      toast.error('Failed to create ICP script');
    }
  };

  const handleICPScriptUpdated = async (updatedScript: ICPStoryScript) => {
    try {
      const script = await supabaseDataService.updateICPScript(updatedScript);
      setICPScripts(prev => prev.map(s => s.id === script.id ? script : s));
      toast.success('ICP script updated successfully');
    } catch (error) {
      console.error('Error updating ICP script:', error);
      toast.error('Failed to update ICP script');
    }
  };

  const handleICPScriptDeleted = async (scriptId: string) => {
    try {
      await supabaseDataService.deleteICPScript(scriptId);
      setICPScripts(prev => prev.filter(script => script.id !== scriptId));
      toast.success('ICP script deleted successfully');
    } catch (error) {
      console.error('Error deleting ICP script:', error);
      toast.error('Failed to delete ICP script');
    }
  };

  // Success Story handlers
  const handleSuccessStoryAdded = async (story: CustomerSuccessStory) => {
    try {
      const newStory = await supabaseDataService.createSuccessStory(story);
      setSuccessStories(prev => [newStory, ...prev]);
      toast.success('Success story created successfully');
    } catch (error) {
      console.error('Error creating success story:', error);
      toast.error('Failed to create success story');
    }
  };

  const handleSuccessStoryUpdated = async (updatedStory: CustomerSuccessStory) => {
    try {
      const story = await supabaseDataService.updateSuccessStory(updatedStory);
      setSuccessStories(prev => prev.map(s => s.id === story.id ? story : s));
      toast.success('Success story updated successfully');
    } catch (error) {
      console.error('Error updating success story:', error);
      toast.error('Failed to update success story');
    }
  };

  const handleSuccessStoryDeleted = async (storyId: string) => {
    try {
      await supabaseDataService.deleteSuccessStory(storyId);
      setSuccessStories(prev => prev.filter(story => story.id !== storyId));
      toast.success('Success story deleted successfully');
    } catch (error) {
      console.error('Error deleting success story:', error);
      toast.error('Failed to delete success story');
    }
  };

  // Product Context handlers
  const handleProductContextAdded = async (context: ProductContext) => {
    try {
      const newContext = await supabaseDataService.createProductContext(context);
      setProductContexts(prev => [newContext, ...prev]);
      toast.success('Product context created successfully');
    } catch (error) {
      console.error('Error creating product context:', error);
      toast.error('Failed to create product context');
    }
  };

  const handleProductContextUpdated = async (updatedContext: ProductContext) => {
    try {
      const context = await supabaseDataService.updateProductContext(updatedContext);
      setProductContexts(prev => prev.map(c => c.id === context.id ? context : c));
      toast.success('Product context updated successfully');
    } catch (error) {
      console.error('Error updating product context:', error);
      toast.error('Failed to update product context');
    }
  };

  const handleProductContextDeleted = async (contextId: string) => {
    try {
      await supabaseDataService.deleteProductContext(contextId);
      setProductContexts(prev => prev.filter(context => context.id !== contextId));
      toast.success('Product context deleted successfully');
    } catch (error) {
      console.error('Error deleting product context:', error);
      toast.error('Failed to delete product context');
    }
  };

  return {
    // Data
    clients,
    authors,
    ideas,
    icpScripts,
    successStories,
    productContexts,
    loading,
    
    // Actions
    loadAllData,
    
    // Client handlers
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted,
    
    // Author handlers
    handleAuthorAdded,
    handleAuthorUpdated,
    handleAuthorDeleted,
    
    // Idea handlers
    handleIdeaAdded,
    handleIdeaUpdated,
    handleIdeaDeleted,
    
    // ICP Script handlers
    handleICPScriptAdded,
    handleICPScriptUpdated,
    handleICPScriptDeleted,
    
    // Success Story handlers
    handleSuccessStoryAdded,
    handleSuccessStoryUpdated,
    handleSuccessStoryDeleted,
    
    // Product Context handlers
    handleProductContextAdded,
    handleProductContextUpdated,
    handleProductContextDeleted,
  };
};

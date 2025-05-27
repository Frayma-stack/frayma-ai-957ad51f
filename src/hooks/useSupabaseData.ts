
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useClientData } from './data/useClientData';
import { useAuthorData } from './data/useAuthorData';
import { useIdeaData } from './data/useIdeaData';
import { useICPScriptData } from './data/useICPScriptData';
import { useSuccessStoryData } from './data/useSuccessStoryData';
import { useProductContextData } from './data/useProductContextData';
import { Client, ProductContext } from '@/types/storytelling';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  console.log('🔄 Supabase Data Hook - User:', user?.email);

  // Initialize all data hooks
  const clientData = useClientData();
  const authorData = useAuthorData();
  const ideaData = useIdeaData();
  const icpScriptData = useICPScriptData();
  const successStoryData = useSuccessStoryData();
  const productContextData = useProductContextData();

  // Load all data when user is available
  const loadAllData = async () => {
    if (!user) {
      console.log('❌ No user - skipping data load');
      return;
    }
    
    console.log('📊 Loading all data for user:', user.email);
    setLoading(true);
    try {
      await Promise.all([
        clientData.loadClients(),
        authorData.loadAuthors(),
        ideaData.loadIdeas(),
        icpScriptData.loadICPScripts(),
        successStoryData.loadSuccessStories(),
        productContextData.loadProductContexts()
      ]);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast.error('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 User authenticated - loading data');
      loadAllData();
    } else {
      console.log('🚪 User logged out - clearing data');
      // Clear data when user logs out
      clientData.setClients([]);
      authorData.setAuthors([]);
      ideaData.setIdeas([]);
      icpScriptData.setICPScripts([]);
      successStoryData.setSuccessStories([]);
      productContextData.setProductContexts([]);
    }
  }, [user]);

  // Enhanced client handlers that can handle product context
  const handleClientAdded = async (client: Client, productContext?: ProductContext) => {
    console.log('➕ Adding client:', client.name, productContext ? 'with product context' : 'without product context');
    return clientData.handleClientAdded(
      client, 
      productContext, 
      productContextData.handleProductContextAdded
    );
  };

  const handleClientUpdated = async (updatedClient: Client, productContext?: ProductContext) => {
    console.log('✏️ Updating client:', updatedClient.name, productContext ? 'with product context' : 'without product context');
    return clientData.handleClientUpdated(
      updatedClient,
      productContext,
      productContextData.handleProductContextAdded,
      productContextData.handleProductContextUpdated,
      productContextData.productContexts
    );
  };

  console.log('📊 Current data counts:', {
    clients: clientData.clients.length,
    authors: authorData.authors.length,
    ideas: ideaData.ideas.length,
    icpScripts: icpScriptData.icpScripts.length,
    successStories: successStoryData.successStories.length,
    productContexts: productContextData.productContexts.length
  });

  return {
    // Data
    clients: clientData.clients,
    authors: authorData.authors,
    ideas: ideaData.ideas,
    icpScripts: icpScriptData.icpScripts,
    successStories: successStoryData.successStories,
    productContexts: productContextData.productContexts,
    loading,
    
    // Actions
    loadAllData,
    
    // Client handlers (enhanced)
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted: clientData.handleClientDeleted,
    
    // Author handlers
    handleAuthorAdded: authorData.handleAuthorAdded,
    handleAuthorUpdated: authorData.handleAuthorUpdated,
    handleAuthorDeleted: authorData.handleAuthorDeleted,
    
    // Idea handlers
    handleIdeaAdded: ideaData.handleIdeaAdded,
    handleIdeaUpdated: ideaData.handleIdeaUpdated,
    handleIdeaDeleted: ideaData.handleIdeaDeleted,
    
    // ICP Script handlers
    handleICPScriptAdded: icpScriptData.handleICPScriptAdded,
    handleICPScriptUpdated: icpScriptData.handleICPScriptUpdated,
    handleICPScriptDeleted: icpScriptData.handleICPScriptDeleted,
    
    // Success Story handlers
    handleSuccessStoryAdded: successStoryData.handleSuccessStoryAdded,
    handleSuccessStoryUpdated: successStoryData.handleSuccessStoryUpdated,
    handleSuccessStoryDeleted: successStoryData.handleSuccessStoryDeleted,
    
    // Product Context handlers
    handleProductContextAdded: productContextData.handleProductContextAdded,
    handleProductContextUpdated: productContextData.handleProductContextUpdated,
    handleProductContextDeleted: productContextData.handleProductContextDeleted,
  };
};

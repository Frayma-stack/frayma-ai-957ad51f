
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import Sidebar from '@/components/Sidebar';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import { useProductContextManager } from '@/hooks/useProductContextManager';
import AssetViewRouter from '@/components/content/AssetViewRouter';
import HomeViewRouter from '@/components/content/HomeViewRouter';
import IdeasBank from '@/components/ideas/IdeasBank';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const {
    clients,
    authors,
    ideas,
    icpScripts,
    successStories,
    productContexts,
    loading: dataLoading,
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted,
    handleAuthorAdded,
    handleAuthorUpdated,
    handleAuthorDeleted,
    handleIdeaAdded,
    handleIdeaUpdated,
    handleIdeaDeleted,
    handleICPScriptAdded,
    handleICPScriptUpdated,
    handleICPScriptDeleted,
    handleSuccessStoryAdded,
    handleSuccessStoryUpdated,
    handleSuccessStoryDeleted,
    handleProductContextAdded,
    handleProductContextUpdated,
    handleProductContextDeleted,
  } = useSupabaseData();

  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'asset' | 'ideas'>('home');

  const {
    getFilteredAuthors,
    getFilteredICPScripts,
    getFilteredSuccessStories,
    getCurrentProductContext,
  } = useContentFiltering({
    selectedClientId,
    authors,
    icpScripts,
    successStories,
    productContexts,
  });

  const { handleProductContextCreatedOrUpdated } = useProductContextManager({
    selectedClientId,
    getCurrentProductContext,
    onProductContextAdded: handleProductContextAdded,
    onProductContextUpdated: handleProductContextUpdated,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
    setSelectedArticleSubtype(null);
    setCurrentView('home');
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
  };

  const handleAssetTypeChange = (type: string) => {
    setSelectedAssetType(type);
    setCurrentView('asset');
  };

  const handleClientSelected = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleIdeasBankSelected = () => {
    setCurrentView('ideas');
  };

  const handleHomeSelected = () => {
    setCurrentView('home');
    setSelectedContentType(null);
    setSelectedArticleSubtype(null);
    setSelectedAssetType('');
  };

  const handleBack = () => {
    if (selectedArticleSubtype) {
      setSelectedArticleSubtype(null);
    } else if (selectedContentType) {
      setSelectedContentType(null);
    } else {
      setCurrentView('home');
      setSelectedAssetType('');
    }
  };

  const handleIdeaContentTypeSelect = (ideaId: string, contentType: string) => {
    console.log('Content type selected for idea:', ideaId, contentType);
    // This could navigate to a content creation flow in the future
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        ideas={ideas}
        selectedClientId={selectedClientId}
        clients={clients}
        onAssetTypeChange={handleAssetTypeChange}
        onClientSelected={handleClientSelected}
        onIdeasBankSelected={handleIdeasBankSelected}
        onHomeSelected={handleHomeSelected}
      />
      
      <div className="flex-1 overflow-hidden">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentView === 'home' ? 'Dashboard' : 
               currentView === 'ideas' ? 'Ideas Bank' : 
               selectedAssetType.charAt(0).toUpperCase() + selectedAssetType.slice(1)}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-auto p-6">
          {dataLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          ) : currentView === 'ideas' ? (
            <IdeasBank
              scripts={getFilteredICPScripts()}
              productContext={getCurrentProductContext()}
              ideas={ideas}
              onIdeaAdded={handleIdeaAdded}
              onIdeaUpdated={handleIdeaUpdated}
              onIdeaDeleted={handleIdeaDeleted}
              selectedClientId={selectedClientId}
              onContentTypeSelect={handleIdeaContentTypeSelect}
            />
          ) : currentView === 'asset' ? (
            <AssetViewRouter
              selectedAssetType={selectedAssetType}
              selectedClientId={selectedClientId}
              clients={clients}
              authors={authors}
              filteredAuthors={getFilteredAuthors()}
              icpScripts={icpScripts}
              filteredICPScripts={getFilteredICPScripts()}
              successStories={successStories}
              filteredSuccessStories={getFilteredSuccessStories()}
              productContexts={productContexts}
              currentProductContext={getCurrentProductContext()}
              ideas={ideas}
              onClientAdded={handleClientAdded}
              onClientUpdated={handleClientUpdated}
              onClientDeleted={handleClientDeleted}
              onAuthorAdded={handleAuthorAdded}
              onAuthorUpdated={handleAuthorUpdated}
              onAuthorDeleted={handleAuthorDeleted}
              onIdeaAdded={handleIdeaAdded}
              onIdeaUpdated={handleIdeaUpdated}
              onIdeaDeleted={handleIdeaDeleted}
              onICPScriptAdded={handleICPScriptAdded}
              onICPScriptUpdated={handleICPScriptUpdated}
              onICPScriptDeleted={handleICPScriptDeleted}
              onSuccessStoryAdded={handleSuccessStoryAdded}
              onSuccessStoryUpdated={handleSuccessStoryUpdated}
              onSuccessStoryDeleted={handleSuccessStoryDeleted}
              onProductContextAdded={handleProductContextAdded}
              onProductContextUpdated={handleProductContextUpdated}
              handleProductContextCreatedOrUpdated={handleProductContextCreatedOrUpdated}
              onIdeaContentTypeSelect={handleIdeaContentTypeSelect}
            />
          ) : (
            <HomeViewRouter
              selectedType={selectedContentType}
              selectedArticleSubtype={selectedArticleSubtype}
              filteredICPScripts={getFilteredICPScripts()}
              filteredSuccessStories={getFilteredSuccessStories()}
              filteredAuthors={getFilteredAuthors()}
              currentProductContext={getCurrentProductContext()}
              ideas={ideas}
              onContentTypeSelect={handleContentTypeSelect}
              onArticleSubtypeSelect={handleArticleSubtypeSelect}
              onBack={handleBack}
              onSuccessStoryAdded={handleSuccessStoryAdded}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;

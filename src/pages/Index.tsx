
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import { useProductContextManager } from '@/hooks/useProductContextManager';
import { useIndexPageState } from '@/hooks/useIndexPageState';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

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

  const {
    selectedContentType,
    selectedArticleSubtype,
    selectedAssetType,
    selectedClientId,
    currentView,
    handleContentTypeSelect,
    handleArticleSubtypeSelect,
    handleAssetTypeChange,
    handleClientSelected,
    handleIdeasBankSelected,
    handleHomeSelected,
    handleBack,
    handleIdeaContentTypeSelect,
  } = useIndexPageState();

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
    <AppLayout
      user={{ email: user.email || '' }}
      dataLoading={dataLoading}
      currentView={currentView}
      selectedContentType={selectedContentType}
      selectedArticleSubtype={selectedArticleSubtype}
      selectedAssetType={selectedAssetType}
      selectedClientId={selectedClientId}
      clients={clients}
      authors={authors}
      ideas={ideas}
      icpScripts={icpScripts}
      successStories={successStories}
      productContexts={productContexts}
      getFilteredAuthors={getFilteredAuthors}
      getFilteredICPScripts={getFilteredICPScripts}
      getFilteredSuccessStories={getFilteredSuccessStories}
      getCurrentProductContext={getCurrentProductContext}
      handleProductContextCreatedOrUpdated={handleProductContextCreatedOrUpdated}
      onAssetTypeChange={handleAssetTypeChange}
      onClientSelected={handleClientSelected}
      onIdeasBankSelected={handleIdeasBankSelected}
      onHomeSelected={handleHomeSelected}
      onContentTypeSelect={handleContentTypeSelect}
      onArticleSubtypeSelect={handleArticleSubtypeSelect}
      onBack={handleBack}
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
      onProductContextDeleted={handleProductContextDeleted}
      onIdeaContentTypeSelect={handleIdeaContentTypeSelect}
    />
  );
};

export default Index;

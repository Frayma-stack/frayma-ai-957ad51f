
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import { useProductContextManager } from '@/hooks/useProductContextManager';
import { useIndexPageState } from '@/hooks/useIndexPageState';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  console.log('🏠 Index Page - Auth Status:', { user: user?.email, authLoading });

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🔄 Redirecting to auth - no user authenticated');
      navigate('/auth');
    } else if (user) {
      console.log('✅ User authenticated:', user.email);
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

  console.log('🎯 Index Page State Summary:', {
    hasUser: !!user,
    authLoading,
    dataLoading,
    currentView,
    selectedClientId,
    selectedContentType,
    dataCount: {
      clients: clients.length,
      authors: authors.length,
      ideas: ideas.length,
      icpScripts: icpScripts.length,
      successStories: successStories.length,
      productContexts: productContexts.length
    }
  });

  // Show loading while checking authentication
  if (authLoading) {
    console.log('⏳ Showing auth loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    console.log('❌ No user - returning null (will redirect)');
    return null;
  }

  console.log('✨ Rendering main application for user:', user.email);

  return (
    <OnboardingProvider>
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
      
      <OnboardingOverlay
        onAuthorAdded={handleAuthorAdded}
        onClientAdded={handleClientAdded}
        onICPScriptAdded={handleICPScriptAdded}
        onNavigateToIdeasBank={handleIdeasBankSelected}
      />
    </OnboardingProvider>
  );
};

export default Index;

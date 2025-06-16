
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useIndexPageState } from "@/hooks/useIndexPageState";
import { EnforcedOnboardingProvider } from "@/components/onboarding/EnforcedOnboardingProvider";
import EnforcedOnboardingOverlay from "@/components/onboarding/EnforcedOnboardingOverlay";
import AppLayout from "@/components/layout/AppLayout";
import { Author, Client, ICPStoryScript, ProductContext } from "@/types/storytelling";

const Index = () => {
  const { user } = useAuth();
  const {
    clients,
    authors,
    ideas,
    icpScripts,
    successStories,
    productContexts,
    loading,
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
    handleOnboardingComplete,
  } = useIndexPageState();

  const [lastAddedClientId, setLastAddedClientId] = useState<string | null>(null);

  console.log('📊 Index Page Data:', {
    user: user?.email,
    clientsCount: clients.length,
    authorsCount: authors.length,
    ideasCount: ideas.length,
    loading,
    selectedClientId,
    currentView
  });

  // Enhanced client handler that tracks the last added client for onboarding
  const handleOnboardingClientAdded = async (client: Client, productContext?: ProductContext) => {
    try {
      const addedClient = await handleClientAdded(client, productContext);
      setLastAddedClientId(addedClient.id);
      return addedClient;
    } catch (error) {
      console.error('Error adding client during onboarding:', error);
      throw error;
    }
  };

  // Enhanced navigation handler for onboarding completion
  const handleNavigateToIdeasBank = () => {
    console.log('🎯 Navigating to Ideas Bank from onboarding, last added client:', lastAddedClientId);
    if (lastAddedClientId) {
      handleOnboardingComplete(lastAddedClientId);
    } else {
      // Fallback to regular ideas bank navigation
      handleIdeasBankSelected();
    }
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    console.log('🎯 View client assets:', { clientId, assetType });
    handleClientSelected(clientId);
    handleAssetTypeChange(assetType);
  };

  if (!user) {
    return <div>Please log in to access the application.</div>;
  }

  return (
    <EnforcedOnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        <AppLayout
          clients={clients}
          authors={authors}
          ideas={ideas}
          icpScripts={icpScripts}
          successStories={successStories}
          productContexts={productContexts}
          selectedContentType={selectedContentType}
          selectedArticleSubtype={selectedArticleSubtype}
          selectedAssetType={selectedAssetType}
          selectedClientId={selectedClientId}
          currentView={currentView}
          onContentTypeSelect={handleContentTypeSelect}
          onArticleSubtypeSelect={handleArticleSubtypeSelect}
          onAssetTypeChange={handleAssetTypeChange}
          onClientSelected={handleClientSelected}
          onIdeasBankSelected={handleIdeasBankSelected}
          onHomeSelected={handleHomeSelected}
          onBack={handleBack}
          onIdeaContentTypeSelect={handleIdeaContentTypeSelect}
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
          loading={loading}
        />

        <EnforcedOnboardingOverlay
          onAuthorAdded={handleAuthorAdded}
          onClientAdded={handleOnboardingClientAdded}
          onICPScriptAdded={handleICPScriptAdded}
          onNavigateToIdeasBank={handleNavigateToIdeasBank}
        />
      </div>
    </EnforcedOnboardingProvider>
  );
};

export default Index;

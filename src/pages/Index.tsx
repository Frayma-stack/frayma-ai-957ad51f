import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useIndexPageState } from "@/hooks/useIndexPageState";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import OnboardingOverlay from "@/components/onboarding/OnboardingOverlay";
import AppLayout from "@/components/layout/AppLayout";
import {
  Author,
  Client,
  ICPStoryScript,
  ProductContext,
} from "@/types/storytelling";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Index = () => {
  const { user } = useAuth();
  const { subscribed, is_trial, loading: sloading } = useSubscription();
  const navigate = useNavigate();
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

  const [lastAddedClientId, setLastAddedClientId] = useState<string | null>(
    null
  );

  console.log("📊 Index Page Data:", {
    user: user?.email,
    clientsCount: clients.length,
    authorsCount: authors.length,
    authorsFirst3: authors.slice(0, 3).map((a) => ({ id: a.id, name: a.name })),
    ideasCount: ideas.length,
    loading,
    selectedClientId,
    currentView,
  });

  // Enhanced client handler that tracks the last added client for onboarding
  const handleOnboardingClientAdded = async (
    client: Client,
    productContext?: ProductContext
  ) => {
    try {
      const addedClient = await handleClientAdded(client, productContext);
      setLastAddedClientId(addedClient.id);
      return addedClient;
    } catch (error) {
      console.error("Error adding client during onboarding:", error);
      throw error;
    }
  };

  // Enhanced navigation handler for onboarding completion
  const handleNavigateToIdeasBank = () => {
    console.log(
      "🎯 Navigating to Ideas Bank from onboarding, last added client:",
      lastAddedClientId
    );
    if (lastAddedClientId) {
      handleOnboardingComplete(lastAddedClientId);
    } else {
      // Fallback to regular ideas bank navigation
      handleIdeasBankSelected();
    }
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    console.log("🎯 View client assets:", { clientId, assetType });
    handleClientSelected(clientId);
    handleAssetTypeChange(assetType);
  };

  if (!user) return navigate("/auth");

  if (!sloading && (!subscribed || !is_trial)) return navigate("/subscription");

  return (
    <OnboardingProvider>
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

        <OnboardingOverlay
          onAuthorAdded={handleAuthorAdded}
          onClientAdded={handleOnboardingClientAdded}
          onICPScriptAdded={handleICPScriptAdded}
          onNavigateToIdeasBank={handleNavigateToIdeasBank}
        />
      </div>
    </OnboardingProvider>
  );
};

export default Index;

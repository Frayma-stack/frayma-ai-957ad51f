
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigation } from "@/hooks/useNavigation";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    clients,
    authors,
    ideas,
    icpScripts,
    successStories,
    productContexts,
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
  } = useLocalStorage();

  const {
    selectedType,
    selectedArticleSubtype,
    currentView,
    selectedClientId,
    handleContentTypeSelect,
    handleArticleSubtypeSelect,
    handleBack,
    handleAssetTypeChange,
    handleClientSelected,
    handleIdeasBankSelected,
    handleHomeSelected,
    handleViewClientAssets,
  } = useNavigation();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handler for idea content type selection
  const handleIdeaContentTypeSelect = (ideaId: string, contentType: string) => {
    console.log('Idea content type selected:', { ideaId, contentType });
    // TODO: Navigate to appropriate content creation flow based on contentType
    // This could trigger navigation to GTM narrative creator, email composer, etc.
  };

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
            <MainContent
              currentView={currentView}
              selectedType={selectedType}
              selectedArticleSubtype={selectedArticleSubtype}
              selectedClientId={selectedClientId}
              clients={clients}
              authors={authors}
              ideas={ideas}
              icpScripts={icpScripts}
              successStories={successStories}
              productContexts={productContexts}
              onContentTypeSelect={handleContentTypeSelect}
              onArticleSubtypeSelect={handleArticleSubtypeSelect}
              onBack={handleBack}
              onClientAdded={handleClientAdded}
              onClientUpdated={handleClientUpdated}
              onClientDeleted={handleClientDeleted}
              onClientSelected={handleClientSelected}
              onViewClientAssets={handleViewClientAssets}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

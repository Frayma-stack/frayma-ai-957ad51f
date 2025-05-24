
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
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted,
    handleAuthorAdded,
    handleAuthorUpdated,
    handleAuthorDeleted,
    handleIdeaAdded,
    handleIdeaUpdated,
    handleIdeaDeleted,
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
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

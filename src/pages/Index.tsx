
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import ContentTypeSelector, { ContentType, ArticleSubType } from "@/components/ContentTypeSelector";
import ArticleTypeSelector from "@/components/ArticleTypeSelector";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedArticleSubtype, setSelectedArticleSubtype] = useState<ArticleSubType | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    if (type === 'article') {
      // Show article sub-type selector
      return;
    }
    // Handle other content types here
    console.log('Selected content type:', type);
  };

  const handleArticleSubtypeSelect = (subtype: ArticleSubType) => {
    setSelectedArticleSubtype(subtype);
    console.log('Selected article subtype:', subtype);
  };

  const handleBack = () => {
    setSelectedType(null);
    setSelectedArticleSubtype(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {selectedType === 'article' && !selectedArticleSubtype ? (
            <ArticleTypeSelector 
              onSelect={handleArticleSubtypeSelect}
              onBack={handleBack}
            />
          ) : (
            <ContentTypeSelector 
              onSelect={handleContentTypeSelect}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

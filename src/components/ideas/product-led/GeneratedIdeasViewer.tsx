import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ChevronRight, RefreshCw, Target } from 'lucide-react';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';
import { parseIdeas, IdeaWithScore, ParsedIdea } from './utils/IdeaParsingUtils';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useSubscription } from '@/contexts/SubscriptionContext';
import ExpandedIdeaCard from './components/ExpandedIdeaCard';
import BlurredIdeaCard from './components/BlurredIdeaCard';
import EmptyIdeasState from './components/EmptyIdeasState';
import IdeasIntroCard from './components/IdeasIntroCard';
import RegenerationLoadingState from './components/RegenerationLoadingState';

interface GeneratedIdeasViewerProps {
  generatedIdeas: string[];
  onBackToGeneration: () => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  onGenerateNewIdeas: () => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  icpId: string;
  isRegenerating?: boolean;
}

const GeneratedIdeasViewer: FC<GeneratedIdeasViewerProps> = ({
  generatedIdeas,
  onBackToGeneration,
  onSaveIdea,
  onGenerateNewIdeas,
  onContentTypeSelect,
  selectedClientId,
  icpId,
  isRegenerating = false
}) => {
  const { toast } = useToast();
  const { subscription_tier } = useSubscription();
  const { createCheckoutSession } = useSubscription();
  const [ideasWithScores, setIdeasWithScores] = useState<IdeaWithScore[]>(
    parseIdeas(generatedIdeas)
  );
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination constants
  const IDEAS_PER_PAGE = 10;
  const totalPages = Math.ceil(ideasWithScores.length / IDEAS_PER_PAGE);
  const currentPageIdeas = ideasWithScores.slice(
    currentPage * IDEAS_PER_PAGE,
    (currentPage + 1) * IDEAS_PER_PAGE
  );

  // For free users, only show first 7 ideas fully, blur the rest
  const isFreeTier = subscription_tier === 'free';
  const maxVisibleIdeas = isFreeTier ? 7 : IDEAS_PER_PAGE;

  const updateIdeaField = (globalIndex: number, field: keyof ParsedIdea, value: string) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === globalIndex ? { ...idea, [field]: value } : idea
    ));
  };

  const updateIdeaScore = (globalIndex: number, score: IdeaScore) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === globalIndex ? { ...idea, score } : idea
    ));
  };

  const handleSaveIdea = (globalIndex: number) => {
    const ideaData = ideasWithScores[globalIndex];
    
    if (!ideaData.score) {
      toast({
        title: "Score Required",
        description: "Please score the idea before saving.",
        variant: "destructive",
      });
      return;
    }

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: ideaData.title,
      narrative: ideaData.narrative,
      productTieIn: ideaData.productTieIn,
      cta: ideaData.cta,
      createdAt: new Date().toISOString(),
      score: ideaData.score,
      source: {
        type: 'manual',
        content: ideaData.originalContent,
      },
      icpId: icpId,
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: [],
      clientId: selectedClientId,
    };

    onSaveIdea(newIdea);
    
    toast({
      title: "Idea Saved",
      description: "The idea has been saved to your ideas bank.",
    });
  };

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession('price_1RY9IYFFhonlvCNPCETa7mf8'); // Narrative Starter plan
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewMore = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Last page reached
      if (isFreeTier) {
        // Prompt free users to upgrade
        handleUpgrade();
      } else {
        // Reset to beginning for paid users
        setCurrentPage(0);
      }
    }
  };

  const getViewMoreButtonText = () => {
    if (currentPage < totalPages - 1) {
      return `View Next ${Math.min(IDEAS_PER_PAGE, ideasWithScores.length - (currentPage + 1) * IDEAS_PER_PAGE)} Ideas`;
    }
    return isFreeTier ? "Upgrade to View More" : "Start Afresh";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Generated Product-Led Ideas</h3>
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages} • {ideasWithScores.length} total ideas
          </p>
        </div>
        <Button
          onClick={onBackToGeneration}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Generation</span>
        </Button>
      </div>

      {ideasWithScores.length === 0 ? (
        <EmptyIdeasState onGenerateNewIdeas={onGenerateNewIdeas} />
      ) : isRegenerating ? (
        <RegenerationLoadingState />
      ) : (
        <>
          <IdeasIntroCard />
          
          <div className="max-h-[700px] overflow-y-auto space-y-6 pr-2">
            {/* Current page ideas */}
            {currentPageIdeas.slice(0, maxVisibleIdeas).map((ideaData, pageIndex) => {
              const globalIndex = currentPage * IDEAS_PER_PAGE + pageIndex;
              return (
                <ExpandedIdeaCard
                  key={ideaData.tempId}
                  ideaData={ideaData}
                  index={globalIndex}
                  icpId={icpId}
                  selectedClientId={selectedClientId}
                  onFieldUpdate={(field, value) => updateIdeaField(globalIndex, field, value)}
                  onScoreUpdate={(score) => updateIdeaScore(globalIndex, score)}
                  onSave={() => handleSaveIdea(globalIndex)}
                  onContentTypeSelect={onContentTypeSelect}
                />
              );
            })}
            
            {/* Blurred ideas for free users */}
            {isFreeTier && currentPageIdeas.slice(maxVisibleIdeas).map((_, pageIndex) => (
              <BlurredIdeaCard
                key={`blurred-${pageIndex}`}
                index={maxVisibleIdeas + pageIndex}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          {/* Navigation and Action Buttons */}
          <div className="flex flex-col space-y-4">
            {/* View More Button */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {currentPage < totalPages - 1 ? "More Ideas Available" : "Cycle Complete"}
                </h4>
                <p className="text-gray-600 mb-4">
                  {currentPage < totalPages - 1 
                    ? "View the next batch of generated ideas from your current prompt."
                    : "You've seen all generated ideas. Start fresh or generate new ones with more specificity."
                  }
                </p>
                <Button 
                  onClick={handleViewMore}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <ChevronRight className="h-5 w-5 mr-2" />
                  {getViewMoreButtonText()}
                </Button>
              </CardContent>
            </Card>

            {/* Generate New Ideas with Specificity Button */}
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Need More Targeted Ideas?</h4>
                <p className="text-gray-600 mb-4">
                  Generate fresh ideas with more specificity by choosing a specific ICP, product feature, and narrative angle.
                </p>
                <Button 
                  onClick={onGenerateNewIdeas}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Generate New Ideas with More Specificity
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedIdeasViewer;

import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';
import { parseIdeas, IdeaWithScore, ParsedIdea } from './utils/IdeaParsingUtils';
import ExpandedIdeaCard from './components/ExpandedIdeaCard';
import EmptyIdeasState from './components/EmptyIdeasState';
import GenerateNewIdeasCTA from './components/GenerateNewIdeasCTA';

interface GeneratedIdeasViewerProps {
  generatedIdeas: string[];
  onBackToGeneration: () => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  onGenerateNewIdeas: () => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  icpId: string;
}

const GeneratedIdeasViewer: FC<GeneratedIdeasViewerProps> = ({
  generatedIdeas,
  onBackToGeneration,
  onSaveIdea,
  onGenerateNewIdeas,
  onContentTypeSelect,
  selectedClientId,
  icpId
}) => {
  const { toast } = useToast();
  const [ideasWithScores, setIdeasWithScores] = useState<IdeaWithScore[]>(
    parseIdeas(generatedIdeas)
  );

  const updateIdeaField = (index: number, field: keyof ParsedIdea, value: string) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === index ? { ...idea, [field]: value } : idea
    ));
  };

  const updateIdeaScore = (index: number, score: IdeaScore) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === index ? { ...idea, score } : idea
    ));
  };

  const handleSaveIdea = (index: number) => {
    const ideaData = ideasWithScores[index];
    
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

  const handleContentTypeSelect = (tempId: string, contentType: string) => {
    // Find the idea data for this tempId
    const ideaData = ideasWithScores.find(idea => idea.tempId === tempId);
    if (ideaData) {
      console.log('🎯 Content type selected for generated idea:', {
        tempId,
        contentType,
        ideaTitle: ideaData.title,
        icpId
      });
      
      // Store the idea data and ICP selection for the content creation flow
      localStorage.setItem('selectedGeneratedIdea', JSON.stringify({
        ...ideaData,
        icpId,
        selectedClientId
      }));
      
      // Pass the tempId to trigger navigation
      onContentTypeSelect(tempId, contentType);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Generated Product-Led Ideas</h3>
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
      ) : (
        <>
          <div className="max-h-[700px] overflow-y-auto space-y-6 pr-2">
            {ideasWithScores.map((ideaData, index) => (
              <ExpandedIdeaCard
                key={ideaData.tempId}
                ideaData={ideaData}
                index={index}
                icpId={icpId}
                selectedClientId={selectedClientId}
                onFieldUpdate={(field, value) => updateIdeaField(index, field, value)}
                onScoreUpdate={(score) => updateIdeaScore(index, score)}
                onSave={() => handleSaveIdea(index)}
                onContentTypeSelect={handleContentTypeSelect}
              />
            ))}
          </div>

          <GenerateNewIdeasCTA onGenerateNewIdeas={onGenerateNewIdeas} />
        </>
      )}
    </div>
  );
};

export default GeneratedIdeasViewer;

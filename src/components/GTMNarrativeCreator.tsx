
import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ICPStoryScript, CustomerSuccessStory, ArticleSubType, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { supabaseDataService } from '@/services/SupabaseDataService';
import IdeaSelector from './IdeaSelector';
import ProgressIndicator from './gtm-narrative/ProgressIndicator';
import GTMNarrativeHeader from './gtm-narrative/GTMNarrativeHeader';
import GTMNarrativeNavigation from './gtm-narrative/GTMNarrativeNavigation';
import GTMStepRenderer from './gtm-narrative/GTMStepRenderer';
import { useGTMNarrativeData } from './gtm-narrative/useGTMNarrativeData';
import { useGTMNarrativeGeneration } from './gtm-narrative/useGTMNarrativeGeneration';
import { useGTMNavigation } from './gtm-narrative/useGTMNavigation';
import { useIdeaSummarization } from '@/hooks/useIdeaSummarization';
import { AutoCraftingConfig } from './gtm-narrative/outline/AutoCraftingReadinessDialog';

interface GTMNarrativeCreatorProps {
  articleSubType: ArticleSubType;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  authors: Author[];
  selectedIdeaId?: string | null;
  selectedClientId?: string | null;
  onBack: () => void;
}

const GTMNarrativeCreator: FC<GTMNarrativeCreatorProps> = ({
  articleSubType,
  scripts,
  successStories,
  ideas,
  authors = [],
  selectedIdeaId,
  selectedClientId,
  onBack
}) => {
  const { summarizeIdeaForContent } = useIdeaSummarization();
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);
  
  const {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2
  } = useGTMNarrativeData();

  // Load product contexts to get all available assets
  useEffect(() => {
    const loadProductContexts = async () => {
      try {
        const contexts = await supabaseDataService.getProductContexts();
        setProductContexts(contexts);
        console.log('GTMNarrativeCreator: Loaded product contexts:', contexts.length);
      } catch (error) {
        console.error('Error loading product contexts:', error);
      }
    };

    loadProductContexts();
  }, []);

  // Enhanced handler for when an idea is selected
  const handleIdeaSelection = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      try {
        const ideaTrigger = await summarizeIdeaForContent(idea);
        handleInputChange('selectedIdeaId', idea.id);
        handleInputChange('ideaTrigger', ideaTrigger);
        
        // Auto-populate other fields if the idea has them
        if (idea.cta) {
          handleInputChange('callToAction', idea.cta);
        }
      } catch (error) {
        console.error('Error summarizing idea for GTM narrative:',);
        // Fallback to basic summary
        const basicSummary = `Based on saved idea "${idea.title}": ${idea.narrative || 'Core concept to be expanded for content creation.'}`;
        handleInputChange('selectedIdeaId', idea.id);
        handleInputChange('ideaTrigger', basicSummary);
      }
    } else {
      handleInputChange('selectedIdeaId', '');
      handleInputChange('ideaTrigger', '');
    }
  };

  const {
    isGenerating,
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  } = useGTMNarrativeGeneration({
    formData,
    scripts,
    successStories,
    authors,
    onDataChange: handleInputChange
  });

  const {
    currentStep,
    contentPhase,
    handleNext,
    handleContentPhaseNext,
    handlePrevious,
    handleBackToOutline
  } = useGTMNavigation({
    formData,
    canProceedFromStep1,
    canProceedFromStep2,
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  });

  const handleProceedToAutoCrafting = (config: AutoCraftingConfig) => {
    console.log('🚀 Proceeding to auto-crafting with config:', config);
    // Store the auto-crafting configuration
    handleInputChange('autoCraftingConfig', config);
    // Start by generating the intro
    generatePhaseContent('intro').then(() => {
      // Proceed to intro generation phase
      handleContentPhaseNext();
    });
  };

  const canProceedFromCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return canProceedFromStep1();
    }
    if (currentStep === 2) {
      return canProceedFromStep2();
    }
    return true;
  };

  // Get the selected idea
  const getSelectedIdea = () => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  };

  const selectedIdea = getSelectedIdea();

  return (
    <div className="space-y-4">
      {/* Idea Selector - only show if we have ideas and are in outline phase */}
      {ideas.length > 0 && contentPhase === 'outline' && (
        <IdeaSelector
          ideas={ideas}
          selectedIdeaId={selectedIdeaId || null}
          onIdeaSelect={handleIdeaSelection}
          selectedClientId={selectedClientId}
        />
      )}

      <Card className="w-full bg-white shadow-sm border-gray-200">
        <GTMNarrativeHeader
          articleSubType={articleSubType}
          contentPhase={contentPhase}
          onBack={onBack}
        />
        
        <CardContent className="space-y-6">
          {contentPhase === 'outline' && <ProgressIndicator currentStep={currentStep} />}
          
          <div className="min-h-[400px]">
            <GTMStepRenderer
              currentStep={currentStep}
              contentPhase={contentPhase}
              formData={formData}
              scripts={scripts}
              successStories={successStories}
              productContexts={productContexts}
              ideas={ideas}
              selectedIdea={selectedIdea}
              articleSubType={articleSubType}
              authors={authors}
              isGenerating={isGenerating}
              onDataChange={handleInputChange}
              onContentPhaseNext={handleContentPhaseNext}
              onBackToOutline={handleBackToOutline}
              onRegenerate={generatePhaseContent}
              onProceedToAutoCrafting={handleProceedToAutoCrafting}
            />
          </div>

          {contentPhase === 'outline' && (
            <GTMNarrativeNavigation
              currentStep={currentStep}
              isGenerating={isGenerating}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canProceed={canProceedFromCurrentStep()}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GTMNarrativeCreator;

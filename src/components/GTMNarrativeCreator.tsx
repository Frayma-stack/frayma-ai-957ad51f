
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ArticleSubType } from './ContentTypeSelector';
import ProgressIndicator from './gtm-narrative/ProgressIndicator';
import GTMNarrativeHeader from './gtm-narrative/GTMNarrativeHeader';
import GTMNarrativeNavigation from './gtm-narrative/GTMNarrativeNavigation';
import GTMStepRenderer from './gtm-narrative/GTMStepRenderer';
import { useGTMNarrativeData } from './gtm-narrative/useGTMNarrativeData';
import { useGTMNarrativeGeneration } from './gtm-narrative/useGTMNarrativeGeneration';
import { useGTMNavigation } from './gtm-narrative/useGTMNavigation';

interface GTMNarrativeCreatorProps {
  articleSubType: ArticleSubType;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  onBack: () => void;
}

const GTMNarrativeCreator: FC<GTMNarrativeCreatorProps> = ({
  articleSubType,
  scripts,
  successStories,
  ideas,
  onBack
}) => {
  const {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2
  } = useGTMNarrativeData();

  const {
    isGenerating,
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  } = useGTMNarrativeGeneration({
    formData,
    scripts,
    successStories,
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

  const canProceedFromCurrentStep = () => {
    if (currentStep === 1) {
      return canProceedFromStep1();
    }
    if (currentStep === 2) {
      return canProceedFromStep2();
    }
    return true;
  };

  return (
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
            ideas={ideas}
            articleSubType={articleSubType}
            isGenerating={isGenerating}
            onDataChange={handleInputChange}
            onContentPhaseNext={handleContentPhaseNext}
            onBackToOutline={handleBackToOutline}
            onRegenerate={generatePhaseContent}
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
  );
};

export default GTMNarrativeCreator;

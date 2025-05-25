
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import SuccessStoryFlowHeader from './SuccessStoryFlowHeader';
import SuccessStoryStepRenderer from './SuccessStoryStepRenderer';
import SuccessStoryProgressIndicator from './SuccessStoryProgressIndicator';
import SuccessStoryFlowNavigation from './SuccessStoryFlowNavigation';
import { useSuccessStoryFlowData } from './useSuccessStoryFlowData';
import { useSuccessStoryFlowState } from './useSuccessStoryFlowState';

interface SuccessStoryFlowCreatorProps {
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  authors: Author[];
  productContext: ProductContext | null;
  onBack: () => void;
  onStoryCreated: (story: CustomerSuccessStory) => void;
}

const SuccessStoryFlowCreator: FC<SuccessStoryFlowCreatorProps> = ({
  scripts,
  successStories,
  authors,
  productContext,
  onBack,
  onStoryCreated
}) => {
  console.log('SuccessStoryFlowCreator rendering with props:', {
    scriptsCount: scripts.length,
    successStoriesCount: successStories.length,
    authorsCount: authors.length,
    hasProductContext: !!productContext
  });

  const {
    formData,
    handleInputChange,
    canProceedFromStep,
    resetForm
  } = useSuccessStoryFlowData();

  const {
    currentStep,
    isGenerating,
    handleNext,
    handlePrevious,
    handleGenerate
  } = useSuccessStoryFlowState({
    authors,
    productContext,
    onBack,
    onStoryCreated,
    formData,
    resetForm
  });

  console.log('SuccessStoryFlowCreator state:', { currentStep, isGenerating });

  return (
    <Card className="w-full bg-white shadow-sm border-gray-200">
      <SuccessStoryFlowHeader onBack={onBack} />
      
      <CardContent className="space-y-6">
        <SuccessStoryProgressIndicator currentStep={currentStep} />
        
        <div className="min-h-[500px]">
          <SuccessStoryStepRenderer
            currentStep={currentStep}
            formData={formData}
            scripts={scripts}
            authors={authors}
            productContext={productContext}
            onDataChange={handleInputChange}
          />
        </div>

        <SuccessStoryFlowNavigation
          currentStep={currentStep}
          canProceed={canProceedFromStep(currentStep)}
          isGenerating={isGenerating}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onGenerate={handleGenerate}
        />
      </CardContent>
    </Card>
  );
};

export default SuccessStoryFlowCreator;

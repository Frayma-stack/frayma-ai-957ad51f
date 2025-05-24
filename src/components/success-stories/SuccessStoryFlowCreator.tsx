
import { FC, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SuccessStoryFlowHeader from './SuccessStoryFlowHeader';
import SuccessStoryStepRenderer from './SuccessStoryStepRenderer';
import SuccessStoryProgressIndicator from './SuccessStoryProgressIndicator';
import { useSuccessStoryFlowData } from './useSuccessStoryFlowData';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    formData,
    handleInputChange,
    canProceedFromStep,
    resetForm
  } = useSuccessStoryFlowData();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement success story generation using custom prompts
    console.log('Generating success story with data:', formData);
    setIsGenerating(false);
  };

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

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === 5 ? (
              <Button
                onClick={handleGenerate}
                disabled={!canProceedFromStep(currentStep) || isGenerating}
                className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate Success Story'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceedFromStep(currentStep)}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStoryFlowCreator;


import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';

interface SuccessStoryFlowNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isGenerating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGenerate: () => void;
}

const SuccessStoryFlowNavigation: FC<SuccessStoryFlowNavigationProps> = ({
  currentStep,
  canProceed,
  isGenerating,
  onPrevious,
  onNext,
  onGenerate
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex gap-4">
        {currentStep === 5 ? (
          <Button
            onClick={onGenerate}
            disabled={!canProceed || isGenerating}
            className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Success Story'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessStoryFlowNavigation;

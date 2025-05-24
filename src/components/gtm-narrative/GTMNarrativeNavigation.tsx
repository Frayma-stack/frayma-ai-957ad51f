
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface GTMNarrativeNavigationProps {
  currentStep: number;
  isGenerating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  canProceed?: boolean;
}

const GTMNarrativeNavigation: FC<GTMNarrativeNavigationProps> = ({
  currentStep,
  isGenerating,
  onPrevious,
  onNext,
  canProceed = true
}) => {
  return (
    <div className="flex justify-between pt-4 border-t border-gray-100">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 1}
        size="sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={isGenerating || !canProceed}
        className="bg-story-blue hover:bg-story-light-blue"
        size="sm"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            AI Building...
          </>
        ) : currentStep === 4 ? (
          <>
            Start Content Generation
            <Sparkles className="h-4 w-4 ml-2" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default GTMNarrativeNavigation;

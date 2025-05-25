
import { FC, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import SuccessStoryFlowHeader from './SuccessStoryFlowHeader';
import SuccessStoryStepRenderer from './SuccessStoryStepRenderer';
import SuccessStoryProgressIndicator from './SuccessStoryProgressIndicator';
import { useSuccessStoryFlowData } from './useSuccessStoryFlowData';
import { useSuccessStoryGeneration } from './useSuccessStoryGeneration';

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
  const { toast } = useToast();

  const {
    formData,
    handleInputChange,
    canProceedFromStep,
    resetForm
  } = useSuccessStoryFlowData();

  const {
    isGenerating,
    generateHeadlineAndOutline,
    generateIntroduction,
    error
  } = useSuccessStoryGeneration();

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
    try {
      // Find the selected author
      const selectedAuthor = authors.find(author => author.id === formData.selectedAuthor);
      
      // Step 1: Generate headline and outline
      const headlineOutline = await generateHeadlineAndOutline(formData, selectedAuthor, productContext);
      
      // Step 2: Generate introduction
      const introduction = await generateIntroduction(formData, selectedAuthor, productContext, undefined, undefined, undefined, {
        wordCount: 500
      });

      // Create the success story object
      const newStory: CustomerSuccessStory = {
        id: `story-${Date.now()}`,
        title: formData.profiledCustomerName + ' Success Story',
        beforeSummary: formData.mainProblem,
        afterSummary: formData.significantTransformation,
        quotes: [
          {
            id: 'quote-1',
            quote: formData.customerQuote01,
            author: formData.championRole01.split(',')[0] || 'Customer',
            title: formData.championRole01.split(',')[1] || 'Team Member'
          }
        ].filter(quote => quote.quote),
        features: [
          {
            id: 'feature-1',
            name: formData.feature01,
            description: formData.feature01Description
          }
        ].filter(feature => feature.name),
        createdAt: new Date().toISOString()
      };

      onStoryCreated(newStory);
      
      toast({
        title: "Success Story Generated!",
        description: "Your success story has been created successfully.",
      });

      // Reset form and go back
      resetForm();
      onBack();

    } catch (err) {
      console.error('Error generating success story:', err);
      toast({
        title: "Generation Failed",
        description: error || "Failed to generate success story. Please try again.",
        variant: "destructive"
      });
    }
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
                <Wand2 className="h-4 w-4" />
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

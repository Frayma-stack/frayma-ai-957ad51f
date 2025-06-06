
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from './useSuccessStoryFlowData';
import { useSuccessStoryGeneration } from './useSuccessStoryGeneration';

interface UseSuccessStoryFlowStateProps {
  authors: Author[];
  productContext: ProductContext | null;
  onBack: () => void;
  onStoryCreated: (story: CustomerSuccessStory) => void;
  formData: SuccessStoryFlowData;
  resetForm: () => void;
}

export const useSuccessStoryFlowState = ({
  authors,
  productContext,
  onBack,
  onStoryCreated,
  formData,
  resetForm
}: UseSuccessStoryFlowStateProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const {
    isGenerating,
    generateHeadlineAndOutline,
    generateIntroduction,
    error
  } = useSuccessStoryGeneration();

  console.log('useSuccessStoryFlowState initialized', { currentStep, isGenerating });

  const handleNext = () => {
    console.log('handleNext called, current step:', currentStep);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log('handlePrevious called, current step:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    console.log('handleGenerate called');
    try {
      // Find the selected author
      const selectedAuthor = authors.find(author => author.id === formData.selectedAuthor);
      console.log('Selected author:', selectedAuthor);
      
      // Step 1: Generate headline and outline
      console.log('Generating headline and outline...');
      const headlineOutline = await generateHeadlineAndOutline(formData, selectedAuthor, productContext);
      console.log('Generated headline outline:', headlineOutline);
      
      // Step 2: Generate introduction
      console.log('Generating introduction...');
      const introduction = await generateIntroduction(formData, selectedAuthor, productContext, undefined, undefined, undefined, {
        wordCount: 500
      });
      console.log('Generated introduction:', introduction);

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
        useCases: [
          {
            id: 'usecase-1',
            useCase: formData.useCase01 || 'Primary Use Case',
            description: formData.useCase01Description || 'Use case description'
          }
        ].filter(useCase => useCase.useCase),
        clientId: '',
        authorId: '',
        icpScriptId: '',
        productContextId: '',
        createdAt: new Date().toISOString()
      };

      console.log('Created story object:', newStory);
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

  return {
    currentStep,
    isGenerating,
    handleNext,
    handlePrevious,
    handleGenerate
  };
};

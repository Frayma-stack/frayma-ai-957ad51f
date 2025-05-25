
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from './useSuccessStoryFlowData';
import { useSuccessStoryGeneration } from './useSuccessStoryGeneration';

interface UseSuccessStoryFlowProps {
  authors: Author[];
  productContext: ProductContext | null;
  onBack: () => void;
  onStoryCreated: (story: CustomerSuccessStory) => void;
}

export const useSuccessStoryFlow = ({
  authors,
  productContext,
  onBack,
  onStoryCreated
}: UseSuccessStoryFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

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

  const handleGenerate = async (formData: SuccessStoryFlowData, resetForm: () => void) => {
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

  return {
    currentStep,
    isGenerating,
    handleNext,
    handlePrevious,
    handleGenerate
  };
};

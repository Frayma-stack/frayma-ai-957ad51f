
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FormData } from './useGTMNarrativeData';

interface UseGTMNavigationProps {
  formData: FormData;
  canProceedFromStep1: () => boolean;
  canProceedFromStep2: () => boolean;
  canProceedFromStep3: () => boolean;
  generateContentTriggers: () => Promise<void>;
  generateHeadlines: () => Promise<void>;
  generatePhaseContent: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
}

export const useGTMNavigation = ({
  formData,
  canProceedFromStep1,
  canProceedFromStep2,
  canProceedFromStep3,
  generateContentTriggers,
  generateHeadlines,
  generatePhaseContent
}: UseGTMNavigationProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [contentPhase, setContentPhase] = useState<'outline' | 'intro' | 'body' | 'conclusion'>('outline');

  const handleNext = async () => {
    if (currentStep === 2) {
      if (!canProceedFromStep2()) {
        toast({
          title: "Missing information",
          description: "Please complete all required fields in Target Reader Resonance.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate only content triggers for step 3 - headlines will be generated when moving to step 4
      await generateContentTriggers();
    }
    
    if (currentStep === 3) {
      if (!canProceedFromStep3()) {
        toast({
          title: "Missing content triggers",
          description: "Please ensure all content discovery triggers are completed.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate headlines after step 3 using the content triggers data
      await generateHeadlines();
    }
    
    if (currentStep === 4) {
      if (!formData.selectedHeadline) {
        toast({
          title: "Please select a headline",
          description: "Choose one of the generated headlines or add your own.",
          variant: "destructive"
        });
        return;
      }
      
      setContentPhase('intro');
      await generatePhaseContent('intro');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleContentPhaseNext = async () => {
    switch (contentPhase) {
      case 'intro':
        setContentPhase('body');
        await generatePhaseContent('body');
        break;
      case 'body':
        setContentPhase('conclusion');
        await generatePhaseContent('conclusion');
        break;
      case 'conclusion':
        toast({
          title: "Content Creation Complete!",
          description: "Your GTM narrative has been successfully generated. You can now export or continue editing."
        });
        break;
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleBackToOutline = () => {
    setContentPhase('outline');
  };

  return {
    currentStep,
    contentPhase,
    handleNext,
    handleContentPhaseNext,
    handlePrevious,
    handleBackToOutline,
    setCurrentStep,
    setContentPhase
  };
};


import { useState } from 'react';
import { FormData } from './useGTMNarrativeData';

type ContentPhase = 'outline' | 'intro' | 'body' | 'conclusion';

interface UseGTMNavigationProps {
  formData: FormData;
  canProceedFromStep1: () => boolean;
  canProceedFromStep2: () => boolean;
  generateContentTriggers: () => Promise<void>;
  generateHeadlines: () => Promise<void>;
  generatePhaseContent: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
}

export const useGTMNavigation = ({
  formData,
  canProceedFromStep1,
  canProceedFromStep2,
  generateContentTriggers,
  generateHeadlines,
  generatePhaseContent
}: UseGTMNavigationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contentPhase, setContentPhase] = useState<ContentPhase>('outline');

  const handleNext = async () => {
    console.log(`Current step: ${currentStep}, proceeding to next...`);
    
    if (currentStep === 1) {
      console.log('Moving from step 1 to step 2...');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      console.log('Moving from step 2 to step 3, generating content triggers...');
      try {
        await generateContentTriggers();
        setCurrentStep(3);
      } catch (error) {
        console.error('Error generating content triggers:', error);
      }
    } else if (currentStep === 3) {
      console.log('Moving from step 3 to step 4, generating headlines...');
      try {
        await generateHeadlines();
        setCurrentStep(4);
      } catch (error) {
        console.error('Error generating headlines:', error);
      }
    }
  };

  const handleContentPhaseNext = async () => {
    console.log(`Current content phase: ${contentPhase}, proceeding to next...`);
    
    switch (contentPhase) {
      case 'outline':
        console.log('Moving to intro phase...');
        setContentPhase('intro');
        try {
          await generatePhaseContent('intro');
        } catch (error) {
          console.error('Error generating intro:', error);
        }
        break;
      case 'intro':
        console.log('Moving to body phase...');
        setContentPhase('body');
        try {
          await generatePhaseContent('body');
        } catch (error) {
          console.error('Error generating body:', error);
        }
        break;
      case 'body':
        console.log('Moving to conclusion phase...');
        setContentPhase('conclusion');
        try {
          await generatePhaseContent('conclusion');
        } catch (error) {
          console.error('Error generating conclusion:', error);
        }
        break;
    }
  };

  const handlePrevious = () => {
    console.log(`Current step: ${currentStep}, going back...`);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToOutline = () => {
    console.log('Returning to outline phase...');
    setContentPhase('outline');
  };

  return {
    currentStep,
    contentPhase,
    handleNext,
    handleContentPhaseNext,
    handlePrevious,
    handleBackToOutline
  };
};

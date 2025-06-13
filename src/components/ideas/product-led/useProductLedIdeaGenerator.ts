
import { useState } from 'react';
import { ICPStoryScript } from '@/types/storytelling';
import { TriggerInput, ProductContextInputs } from './hooks/types';
import { usePromptBuilder } from './hooks/usePromptBuilder';
import { useIdeaValidation } from './hooks/useIdeaValidation';
import { useIdeaGeneration } from './hooks/useIdeaGeneration';

export const useProductLedIdeaGenerator = (icpScripts: ICPStoryScript[]) => {
  const [showIdeasViewer, setShowIdeasViewer] = useState(false);
  const [showRegenerationDialog, setShowRegenerationDialog] = useState(false);
  const [regenerationDirection, setRegenerationDirection] = useState('');

  const [triggerInput, setTriggerInput] = useState<TriggerInput>({
    type: 'text',
    content: ''
  });

  const [productInputs, setProductInputs] = useState<ProductContextInputs>({
    targetICP: '',
    narrativeAnchor: 'belief',
    selectedNarrativeTypes: [],
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: [],
    productContextType: '',
    customPOV: ''
  });

  const selectedICP = icpScripts.find(icp => icp.id === productInputs.targetICP);

  const { buildInitialPrompt, buildRegenerationPrompt } = usePromptBuilder();
  const { validateInputs, validateRegenerationDirection } = useIdeaValidation();
  const { isGenerating, generatedIdeas, setGeneratedIdeas, generateIdeas, regenerateIdeas } = useIdeaGeneration();

  const handleGenerateIdeas = async () => {
    if (!validateInputs(triggerInput, productInputs)) return;

    try {
      const prompt = buildInitialPrompt(triggerInput, productInputs, selectedICP);
      await generateIdeas(prompt);
      setShowIdeasViewer(true);
    } catch (error) {
      // Error handling is done in the generation hook
    }
  };

  const handleRegenerateWithDirection = async () => {
    if (!validateRegenerationDirection(regenerationDirection)) return;

    setShowRegenerationDialog(false);
    
    try {
      const prompt = buildRegenerationPrompt(triggerInput, productInputs, selectedICP, regenerationDirection);
      await regenerateIdeas(prompt);
      setRegenerationDirection(''); // Clear the direction input
    } catch (error) {
      // Error handling is done in the generation hook
    }
  };

  const handleBackToGeneration = () => {
    setShowIdeasViewer(false);
    setShowRegenerationDialog(false);
    setRegenerationDirection('');
  };

  const handleGenerateNewIdeas = async () => {
    setShowRegenerationDialog(true);
  };

  return {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    showRegenerationDialog,
    regenerationDirection,
    setRegenerationDirection,
    isGenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas,
    handleRegenerateWithDirection,
    setShowRegenerationDialog,
    validateInputs: () => validateInputs(triggerInput, productInputs)
  };
};

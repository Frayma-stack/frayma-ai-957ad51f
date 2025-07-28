
import { useState } from 'react';
import { ICPStoryScript } from '@/types/storytelling';
import { TriggerInput, ProductContextInputs } from './hooks/types';
import { usePromptBuilder } from './hooks/usePromptBuilder';
import { useIdeaValidation } from './hooks/useIdeaValidation';
import { useIdeaGeneration } from './hooks/useIdeaGeneration';
import { SpecificGenerationData } from './SpecificIdeaGenerationDialog';

export const useProductLedIdeaGenerator = (icpScripts: ICPStoryScript[]) => {
  const [showIdeasViewer, setShowIdeasViewer] = useState(false);
  const [showRegenerationDialog, setShowRegenerationDialog] = useState(false);
  const [showSpecificGenerationDialog, setShowSpecificGenerationDialog] = useState(false);
  const [regenerationDirection, setRegenerationDirection] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

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
    customPOV: '',
    povNarrativeDirection: ''
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
    setIsRegenerating(true); // Start regeneration loading state
    
    try {
      const prompt = buildRegenerationPrompt(triggerInput, productInputs, selectedICP, regenerationDirection);
      await regenerateIdeas(prompt);
      setRegenerationDirection(''); // Clear the direction input
    } catch (error) {
      // Error handling is done in the generation hook
    } finally {
      setIsRegenerating(false); // End regeneration loading state
    }
  };

  const handleBackToGeneration = () => {
    setShowIdeasViewer(false);
    setShowRegenerationDialog(false);
    setRegenerationDirection('');
    setIsRegenerating(false);
  };

  const handleGenerateNewIdeas = async () => {
    setShowSpecificGenerationDialog(true);
  };

  const handleGenerateSpecificIdeas = async (data: SpecificGenerationData) => {
    setShowSpecificGenerationDialog(false);
    // TODO: Implement specific idea generation logic
    console.log('Generating specific ideas with:', data);
  };

  return {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    showRegenerationDialog,
    showSpecificGenerationDialog,
    regenerationDirection,
    setRegenerationDirection,
    isGenerating,
    isRegenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas,
    handleGenerateSpecificIdeas,
    handleRegenerateWithDirection,
    setShowRegenerationDialog,
    setShowSpecificGenerationDialog,
    validateInputs: () => validateInputs(triggerInput, productInputs)
  };
};

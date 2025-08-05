
import { useState } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { TriggerInput, ProductContextInputs } from './hooks/types';
import { usePromptBuilder } from './hooks/usePromptBuilder';
import { useIdeaValidation } from './hooks/useIdeaValidation';
import { useIdeaGeneration } from './hooks/useIdeaGeneration';
import { SpecificGenerationData } from './SpecificIdeaGenerationDialog';

export const useProductLedIdeaGenerator = (icpScripts: ICPStoryScript[], productContext?: ProductContext | null) => {
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
    businessContextItem: '',
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: [],
    selectedSuccessStory: null,
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
      const prompt = buildInitialPrompt(triggerInput, productInputs, selectedICP, productContext);
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
      const prompt = buildRegenerationPrompt(triggerInput, productInputs, selectedICP, regenerationDirection, productContext);
      await regenerateIdeas(prompt);
      setRegenerationDirection(''); // Clear the direction input
    } catch (error) {
      // Error handling is done in the generation hook
    } finally {
      setIsRegenerating(false); // End regeneration loading state
    }
  };

  const handleEnhancedRegeneration = async (newInputs: ProductContextInputs, direction: string) => {
    if (!validateRegenerationDirection(direction)) return;

    // Update the product inputs with new selections
    setProductInputs(newInputs);
    
    setShowRegenerationDialog(false);
    setIsRegenerating(true);
    
    try {
      const newSelectedICP = icpScripts.find(icp => icp.id === newInputs.targetICP);
      const prompt = buildRegenerationPrompt(triggerInput, newInputs, newSelectedICP, direction, productContext);
      await regenerateIdeas(prompt);
      setRegenerationDirection(''); // Clear the direction input
    } catch (error) {
      // Error handling is done in the generation hook
    } finally {
      setIsRegenerating(false);
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
    setIsRegenerating(true);
    
    try {
      // Find the selected ICP and product feature
      const selectedICP = icpScripts.find(icp => icp.id === data.targetICP);
      
      // Build a specific prompt for targeted idea generation
      const specificPrompt = buildSpecificIdeaPrompt(data, selectedICP);
      await regenerateIdeas(specificPrompt);
    } catch (error) {
      console.error('Error generating specific ideas:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const buildSpecificIdeaPrompt = (data: SpecificGenerationData, selectedICP?: ICPStoryScript) => {
    return `You are Frayma AI, a Product-Led Storytelling engine. Generate 15 highly targeted GTM content ideas based on these specific parameters:

TARGET ICP: ${selectedICP?.name || data.targetICP}
${selectedICP ? `
ICP Details:
- Demographics: ${selectedICP.demographics || 'Not specified'}
- Primary Pains: ${selectedICP.internalPains?.slice(0, 3).map(item => item.content).join(', ') || 'Not specified'}
- External Struggles: ${selectedICP.externalStruggles?.slice(0, 3).map(item => item.content).join(', ') || 'Not specified'}
- Core Beliefs: ${selectedICP.coreBeliefs.slice(0, 3).map(item => item.content).join(', ')}
- Desired Transformations: ${selectedICP.desiredTransformations?.slice(0, 3).map(item => item.content).join(', ') || 'Not specified'}
` : ''}

PRODUCT FEATURE/CONTEXT: ${data.productFeature}

NARRATIVE ANGLE: ${data.narrativeAngle}

Generate 15 ideas that specifically tie these elements together. Each idea should:
1. Directly address the selected ICP's specific pains and beliefs
2. Clearly connect to the chosen product feature/context
3. Follow the narrative angle provided
4. Be actionable and specific (not generic)

Format each idea as:
Title: [Compelling, first-person style title]
Narrative: [Specific angle that connects the ICP pain/belief to the product context through the narrative angle]
Product Tie-in: [How this specifically showcases the selected product feature/context]
CTA: [Specific call-to-action related to the product feature]

Focus on being highly specific and targeted rather than broad or generic.`;
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
    handleEnhancedRegeneration,
    setShowRegenerationDialog,
    setShowSpecificGenerationDialog,
    validateInputs: () => validateInputs(triggerInput, productInputs)
  };
};

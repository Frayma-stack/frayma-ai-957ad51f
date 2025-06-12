
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';

interface TriggerInput {
  type: 'text' | 'image' | 'file';
  content: string;
}

interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  selectedNarrativeTypes: string[];
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
  productContextType: 'features' | 'usecases' | 'differentiators' | '';
  customPOV: string;
}

export const useProductLedIdeaGenerator = (icpScripts: ICPStoryScript[]) => {
  const { toast } = useToast();
  const { generateContent } = useChatGPT();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [showIdeasViewer, setShowIdeasViewer] = useState(false);

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

  const buildPrompt = (): string => {
    const narrativeTypeContents = productInputs.selectedNarrativeTypes.map(typeId => {
      const narrativeTypes = selectedICP ? (() => {
        switch (productInputs.narrativeAnchor) {
          case 'belief': return selectedICP.coreBeliefs;
          case 'pain': return selectedICP.internalPains;
          case 'struggle': return selectedICP.externalStruggles;
          case 'transformation': return selectedICP.desiredTransformations;
          default: return [];
        }
      })() : [];
      return narrativeTypes.find(n => n.id === typeId)?.content || '';
    }).filter(content => content);
    
    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach that crafts first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's, but through compelling, point-of-view-driven narratives that match how buyers think and decide.

You are a world-class narrative strategist helping B2B SaaS teams craft compelling, resonant GTM narratives. Using the Product-Led Storytelling approach above, generate 15 rare, non-obvious content ideas (for articles, newsletters, sales emails, and LinkedIn posts) that subtly weave in product value without sounding salesy.

Trigger/thesis/anti-thesis: ${triggerInput.content}
Target audience: ${selectedICP?.name || 'Not specified'}
Narrative angles to address: ${productInputs.narrativeAnchor} — "${narrativeTypeContents.join('; ')}"`;

    // Add product context based on selected type
    if (productInputs.productContextType === 'features' && productInputs.selectedFeatures.length > 0) {
      prompt += `\nProduct features and/or benefits:\n`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `• ${feature.name}: ${feature.benefits.join(', ')}\n`;
      });
    }

    if (productInputs.productContextType === 'usecases' && productInputs.selectedUseCases.length > 0) {
      prompt += `\nSpecific use cases to subtly highlight:\n`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `• ${useCase.useCase} (${useCase.userRole}): ${useCase.description}\n`;
      });
    }

    if (productInputs.productContextType === 'differentiators' && productInputs.selectedDifferentiators.length > 0) {
      prompt += `\nProduct differentiators to weave in:\n`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `• ${diff.name}: ${diff.description}\n`;
      });
    }

    if (productInputs.customPOV.trim()) {
      prompt += `\nThe user's personal POV or perspective to shape the tone of ideas:\nPOV: ${productInputs.customPOV}`;
    }

    prompt += `\n\nFor each idea, return the following structure:
Title – punchy and specific (not generic, not clickbait).
Narrative – what's the tension or belief this idea challenges or advances?
Product Tie-in – how can this idea naturally surface the selected product's unique value?
CTA – one specific, low-friction action the reader would be compelled to take.

Make each idea smart, strategic, and tailored to ${selectedICP?.name || 'the target ICP'}—as if you're helping them see themselves in the story.
Avoid fluff. Think like a narrative strategist guiding a category-defining founder or Head of Marketing.`;

    return prompt;
  };

  const validateInputs = (): boolean => {
    if (!triggerInput.content.trim()) {
      toast({
        title: "Missing Trigger",
        description: "Please provide a trigger/thesis to generate ideas.",
        variant: "destructive",
      });
      return false;
    }

    if (!productInputs.targetICP) {
      toast({
        title: "Missing Target ICP",
        description: "Please select a target ICP.",
        variant: "destructive",
      });
      return false;
    }

    if (productInputs.selectedNarrativeTypes.length === 0) {
      toast({
        title: "Missing Narrative Types",
        description: "Please select at least one narrative type.",
        variant: "destructive",
      });
      return false;
    }

    if (!productInputs.productContextType) {
      toast({
        title: "Missing Product Context",
        description: "Please choose either Product Features, Use Cases, or Differentiators.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleGenerateIdeas = async () => {
    if (!validateInputs()) return;

    setIsGenerating(true);
    try {
      console.log('💡 Starting idea generation process...');
      
      const prompt = buildPrompt();
      console.log('💡 Built prompt with length:', prompt.length);
      
      const response = await generateContent(prompt);
      console.log('💡 Received response:', response ? 'Success' : 'Empty response');
      
      if (!response || typeof response !== 'string') {
        console.error('💡 Invalid response received:', response);
        throw new Error('Invalid response received from content generation');
      }

      if (response.trim() === '') {
        console.error('💡 Empty response content');
        throw new Error('Empty content received from generation');
      }
      
      const ideas = response.split(/(?=Title[\s\-–:]+)/i).filter(idea => idea.trim() !== '');
      console.log('💡 Parsed ideas count:', ideas.length);
      
      if (ideas.length === 0) {
        throw new Error('No valid ideas could be parsed from the response');
      }
      
      setGeneratedIdeas(ideas);
      setShowIdeasViewer(true);
      
      toast({
        title: "Ideas Generated",
        description: `Generated ${ideas.length} Product-Led Storytelling ideas.`,
      });
      
    } catch (error) {
      console.error("💡 Error generating ideas:", error);
      
      // Provide specific error messages based on the error type
      let errorMessage = "Failed to generate ideas. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('API request failed')) {
          errorMessage = "API connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes('Empty response')) {
          errorMessage = "No content was generated. Please try rephrasing your trigger or reducing the complexity.";
        } else if (error.message.includes('JSON')) {
          errorMessage = "Response parsing failed. Please try again or contact support if the issue persists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToGeneration = () => {
    setShowIdeasViewer(false);
  };

  const handleGenerateNewIdeas = async () => {
    setShowIdeasViewer(false);
    // Small delay to show transition
    setTimeout(() => {
      handleGenerateIdeas();
    }, 100);
  };

  return {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    isGenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas,
    validateInputs
  };
};

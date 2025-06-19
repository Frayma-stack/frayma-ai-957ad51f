
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript } from '@/types/storytelling';
import { FormData } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UsePhaseContentGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const usePhaseContentGeneration = ({
  formData,
  scripts,
  onDataChange
}: UsePhaseContentGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const { interpolateTemplate } = usePromptConfig();

  const generatePhaseContent = async (phase: 'intro' | 'body' | 'conclusion') => {
    if (!isConfigured) {
      toast({
        title: "ChatGPT not configured",
        description: "Please configure your ChatGPT API key to use auto-generation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
      const selectedHeadline = formData.headlineOptions.find(h => h.id === formData.selectedHeadline);
      
      let variables: Record<string, any> = {};
      let promptCategory: 'intro_generation' | 'body_generation' | 'conclusion_generation';
      let contentKey: keyof FormData;
      
      switch (phase) {
        case 'intro':
          promptCategory = 'intro_generation';
          contentKey = 'generatedIntro';
          variables = {
            selectedHeadline: selectedHeadline?.text || 'Compelling Article Title',
            mainTargetICP: selectedScript?.name || 'Professional audience',
            ideaTrigger: formData.ideaTrigger
          };
          break;
          
        case 'body':
          promptCategory = 'body_generation';
          contentKey = 'generatedBody';
          variables = {
            outlineSections: formData.outlineSections.filter(s => s.phase === 'relevance').map(s => s.title).join(', '),
            outlineContext: formData.outlineSections.filter(s => s.phase === 'relevance' && s.context).map(s => s.context).join('; ')
          };
          break;
          
        case 'conclusion':
          promptCategory = 'conclusion_generation';
          contentKey = 'generatedConclusion';
          variables = {
            outlineSections: formData.outlineSections.filter(s => s.phase === 'results').map(s => s.title).join(', '),
            callToAction: formData.callToAction
          };
          break;
      }

      const prompt = interpolateTemplate(promptCategory, variables);
      console.log(`Generated ${phase} prompt:`, prompt);
      
      const response = await generateContent(prompt);
      console.log(`Raw ${phase} response:`, response);
      
      onDataChange(contentKey, response);
      
      toast({
        title: "Content generated",
        description: `${phase.charAt(0).toUpperCase() + phase.slice(1)} section has been generated successfully.`
      });
    } catch (error) {
      console.error(`Error generating ${phase} content:`, error);
      toast({
        title: "Generation failed",
        description: `Failed to generate ${phase} content. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePhaseContent
  };
};

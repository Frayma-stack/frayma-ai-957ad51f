
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript } from '@/types/storytelling';
import { FormData, HeadlineOption, OutlineSection } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UseHeadlinesGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useHeadlinesGeneration = ({
  formData,
  scripts,
  onDataChange
}: UseHeadlinesGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const { interpolateTemplate } = usePromptConfig();

  const generateOutlineSections = async () => {
    try {
      const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
      
      const variables = {
        ideaTrigger: formData.ideaTrigger,
        mainTargetICP: selectedScript?.name || 'Professional audience',
        problemStatements: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('outline_sections', variables);
      const response = await generateContent(prompt);
      const outlineData = JSON.parse(response);
      
      const outlineSections: OutlineSection[] = outlineData.sections.map((section: any, index: number) => ({
        id: `section_${index}`,
        type: section.type || 'H2' as 'H2' | 'H3' | 'H4',
        title: section.title,
        phase: section.phase || 'attract' as 'attract' | 'filter' | 'engage' | 'results',
        context: '',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      }));
      
      onDataChange('outlineSections', outlineSections);
    } catch (error) {
      console.error('Error generating outline sections:', error);
    }
  };

  const generateHeadlines = async () => {
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
      
      const variables = {
        ideaTrigger: formData.ideaTrigger,
        targetKeyword: formData.targetKeyword,
        mainTargetICP: selectedScript?.name || 'Professional audience',
        journeyStage: formData.journeyStage,
        mutualGoal: formData.mutualGoal,
        relatedKeywords: formData.relatedKeywords.join(', '),
        problemStatements: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('headlines_generation', variables);
      const response = await generateContent(prompt);
      const headlineData = JSON.parse(response);
      
      const headlineOptions: HeadlineOption[] = headlineData.headlines.map((text: string, index: number) => ({
        id: `generated_${index}`,
        text,
        isGenerated: true
      }));
      
      onDataChange('headlineOptions', headlineOptions);
      await generateOutlineSections();
      
      toast({
        title: "Headlines generated",
        description: "Review and select your preferred headline, then refine the content outline."
      });
    } catch (error) {
      console.error('Error generating headlines:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate headlines. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateHeadlines
  };
};

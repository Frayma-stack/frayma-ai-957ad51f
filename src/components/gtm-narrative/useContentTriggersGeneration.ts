
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { FormData } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UseContentTriggersGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useContentTriggersGeneration = ({
  formData,
  scripts,
  successStories,
  onDataChange
}: UseContentTriggersGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const { interpolateTemplate } = usePromptConfig();

  const generateContentTriggers = async () => {
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
      const selectedSuccessStory = successStories.find(s => s.id === formData.successStory);
      const strategicSuccessStory = successStories.find(s => s.id === formData.strategicSuccessStory);
      
      const variables = {
        ideaTrigger: formData.ideaTrigger,
        mutualGoal: formData.mutualGoal,
        targetKeyword: formData.targetKeyword,
        contentCluster: formData.contentCluster,
        publishReason: formData.publishReason,
        callToAction: formData.callToAction,
        strategicSuccessStory: strategicSuccessStory ? `${strategicSuccessStory.title} - Before: ${strategicSuccessStory.beforeSummary} - After: ${strategicSuccessStory.afterSummary}` : 'Not selected',
        mainTargetICP: selectedScript?.name || 'Not selected',
        journeyStage: formData.journeyStage,
        readingPrompt: formData.readingPrompt,
        narrativeAnchors: formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; '),
        successStory: selectedSuccessStory?.title || 'Not selected'
      };

      const prompt = interpolateTemplate('content_triggers', variables);
      const response = await generateContent(prompt);
      const suggestions = JSON.parse(response);
      
      onDataChange('relatedKeywords', suggestions.relatedKeywords || []);
      onDataChange('searchQueries', suggestions.searchQueries || []);
      onDataChange('problemStatements', suggestions.problemStatements || []);

      toast({
        title: "AI suggestions generated",
        description: "Review and refine the content discovery triggers to guide your narrative creation."
      });
    } catch (error) {
      console.error('Error generating content triggers:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content triggers. Please try again or fill them manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateContentTriggers
  };
};

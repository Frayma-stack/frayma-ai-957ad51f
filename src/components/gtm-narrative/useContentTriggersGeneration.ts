
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { FormData } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UseContentTriggersGenerationProps {
  formData: FormData;
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useContentTriggersGeneration = ({ 
  formData, 
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
      const variables = {
        trigger_or_thesis: formData.ideaTrigger || 'Strategic content initiative',
        mutual_goal: formData.mutualGoal || 'Drive engagement and conversions',
        main_keyword: formData.targetKeyword || 'product-led growth',
        cluster: formData.contentCluster || 'GTM strategy',
        why_publish: formData.publishReason || 'Establish thought leadership',
        cta: formData.callToAction || 'Contact us to learn more',
        main_icp: formData.mainTargetICP || 'Business decision makers',
        journey_stage: formData.journeyStage || 'MOFU',
        broader_audience: formData.broaderAudience || 'Tech professionals',
        motivation: formData.readingPrompt || 'Looking for strategic insights',
        anchors_and_types: formData.narrativeAnchors?.map(a => `${a.name} (${a.type}): ${a.content}`).join('; ') || 'Key messaging points',
        success_story_summary: formData.successStory || 'Customer transformation example'
      };

      const prompt = interpolateTemplate('content_triggers', variables);
      console.log('Generated content triggers prompt:', prompt);
      
      const response = await generateContent(prompt);
      console.log('Raw content triggers response:', response);
      
      // Parse the response to extract keywords, queries, and problems
      const parseContentTriggers = (text: string) => {
        const keywordMatch = text.match(/Related Keywords?:?\s*(.*?)(?=Search Queries|Problem Statements|$)/is);
        const queryMatch = text.match(/Search Queries?.*?:?\s*(.*?)(?=Problem Statements|Related Keywords|$)/is);
        const problemMatch = text.match(/Problem Statements?:?\s*(.*?)$/is);
        
        const extractItems = (match: RegExpMatchArray | null) => {
          if (!match) return [];
          return match[1]
            .split(/[-•\n]/)
            .map(item => item.trim())
            .filter(item => item && item.length > 3)
            .slice(0, 10);
        };

        return {
          keywords: extractItems(keywordMatch),
          queries: extractItems(queryMatch),
          problems: extractItems(problemMatch)
        };
      };

      const parsed = parseContentTriggers(response);
      
      onDataChange('relatedKeywords', parsed.keywords);
      onDataChange('searchQueries', parsed.queries);
      onDataChange('problemStatements', parsed.problems);
      
      toast({
        title: "Content triggers generated",
        description: "Keywords, search queries, and problem statements have been generated successfully."
      });
      
    } catch (error) {
      console.error('Error generating content triggers:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content triggers. Please try again.",
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

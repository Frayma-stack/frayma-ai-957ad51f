
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
        trigger_or_thesis: formData.ideaTrigger,
        mutual_goal: formData.mutualGoal,
        main_keyword: formData.targetKeyword,
        cluster: formData.contentCluster,
        why_publish: formData.publishReason,
        cta: formData.callToAction,
        main_icp: selectedScript?.name || 'Not selected',
        journey_stage: formData.journeyStage,
        broader_audience: 'General professional audience',
        motivation: formData.readingPrompt,
        anchors_and_types: formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; '),
        success_story_summary: selectedSuccessStory ? `${selectedSuccessStory.title} - Before: ${selectedSuccessStory.beforeSummary} - After: ${selectedSuccessStory.afterSummary}` : 'Not selected'
      };

      const prompt = interpolateTemplate('content_triggers', variables);
      console.log('Generated prompt for content triggers:', prompt);
      
      const response = await generateContent(prompt);
      console.log('Raw response from AI:', response);
      
      // Try to parse the response - handle both JSON and text formats
      let parsedResponse;
      try {
        // First try to parse as JSON
        parsedResponse = JSON.parse(response);
      } catch (jsonError) {
        console.log('Response is not JSON, attempting to extract structured data...');
        
        // Extract data using regex patterns
        const keywordSection = response.match(/related keywords?[:\s]*\n?([\s\S]*?)(?=\n\n|\nsearch queries?|$)/i);
        const queriesSection = response.match(/search queries?[:\s]*\n?([\s\S]*?)(?=\n\n|\nproblem statements?|$)/i);
        const problemsSection = response.match(/problem statements?[:\s]*\n?([\s\S]*?)$/i);
        
        const extractItems = (text: string) => {
          if (!text) return [];
          return text.split('\n')
            .map(line => line.replace(/^[-•*]\s*/, '').trim())
            .filter(line => line.length > 0 && !line.match(/^\d+\./));
        };
        
        parsedResponse = {
          relatedKeywords: keywordSection ? extractItems(keywordSection[1]) : [],
          searchQueries: queriesSection ? extractItems(queriesSection[1]) : [],
          problemStatements: problemsSection ? extractItems(problemsSection[1]) : []
        };
      }
      
      console.log('Parsed response:', parsedResponse);
      
      // Update form data with the parsed response
      onDataChange('relatedKeywords', parsedResponse.relatedKeywords || []);
      onDataChange('searchQueries', parsedResponse.searchQueries || []);
      onDataChange('problemStatements', parsedResponse.problemStatements || []);

      toast({
        title: "Content triggers generated",
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

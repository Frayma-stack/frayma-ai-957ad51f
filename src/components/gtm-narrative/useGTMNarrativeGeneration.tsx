
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { FormData, HeadlineOption, OutlineSection, NarrativeAnchor } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UseGTMNarrativeGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useGTMNarrativeGeneration = ({
  formData,
  scripts,
  successStories,
  onDataChange
}: UseGTMNarrativeGenerationProps) => {
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

  const generatePhaseContent = async (phase: 'intro' | 'body' | 'conclusion') => {
    if (!isConfigured) return;
    
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
            selectedHeadline: selectedHeadline?.text || '',
            mainTargetICP: selectedScript?.name || '',
            ideaTrigger: formData.ideaTrigger
          };
          break;
          
        case 'body':
          promptCategory = 'body_generation';
          contentKey = 'generatedBody';
          variables = {
            outlineSections: formData.outlineSections.filter(s => s.phase === 'engage').map(s => s.title).join(', '),
            outlineContext: formData.outlineSections.filter(s => s.phase === 'engage' && s.context).map(s => s.context).join('; ')
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
      const response = await generateContent(prompt);
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
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  };
};

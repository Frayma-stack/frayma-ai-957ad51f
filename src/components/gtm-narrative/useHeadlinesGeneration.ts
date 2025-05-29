
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
        trigger_or_thesis: formData.ideaTrigger,
        main_icp: selectedScript?.name || 'Professional audience',
        problem_statements_list: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('outline_sections', variables);
      console.log('Generated outline prompt:', prompt);
      
      const response = await generateContent(prompt);
      console.log('Raw outline response:', response);
      
      // Try to parse as JSON first, then extract text
      let outlineData;
      try {
        outlineData = JSON.parse(response);
      } catch (jsonError) {
        console.log('Outline response is not JSON, creating default sections...');
        
        // Create default sections if parsing fails
        outlineData = {
          sections: [
            { type: 'H2', title: 'The Challenge', phase: 'attract' },
            { type: 'H2', title: 'Understanding the Problem', phase: 'filter' },
            { type: 'H2', title: 'The Solution Approach', phase: 'engage' },
            { type: 'H2', title: 'Results and Impact', phase: 'results' }
          ]
        };
      }
      
      const outlineSections: OutlineSection[] = (outlineData.sections || []).map((section: any, index: number) => ({
        id: `section_${index}`,
        type: section.type || 'H2' as 'H2' | 'H3' | 'H4',
        title: section.title || `Section ${index + 1}`,
        phase: section.phase || 'engage' as 'attract' | 'filter' | 'engage' | 'results',
        context: '',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      }));
      
      onDataChange('outlineSections', outlineSections);
    } catch (error) {
      console.error('Error generating outline sections:', error);
      
      // Fallback to default sections
      const defaultSections: OutlineSection[] = [
        { id: 'section_0', type: 'H2', title: 'The Challenge', phase: 'attract', context: '', linkedAssetType: undefined, linkedAssetId: undefined },
        { id: 'section_1', type: 'H2', title: 'Understanding the Problem', phase: 'filter', context: '', linkedAssetType: undefined, linkedAssetId: undefined },
        { id: 'section_2', type: 'H2', title: 'The Solution Approach', phase: 'engage', context: '', linkedAssetType: undefined, linkedAssetId: undefined },
        { id: 'section_3', type: 'H2', title: 'Results and Impact', phase: 'results', context: '', linkedAssetType: undefined, linkedAssetId: undefined }
      ];
      onDataChange('outlineSections', defaultSections);
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
        trigger_or_thesis: formData.ideaTrigger,
        mutual_goal: formData.mutualGoal,
        main_keyword: formData.targetKeyword,
        cluster: formData.contentCluster,
        why_publish: formData.publishReason,
        cta: formData.callToAction,
        main_icp: selectedScript?.name || 'Professional audience',
        journey_stage: formData.journeyStage,
        motivation: formData.readingPrompt,
        anchors_and_types: formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; '),
        success_story_summary: 'Customer success transformation',
        related_keywords_list: formData.relatedKeywords.join(', '),
        search_queries_list: formData.searchQueries.join('; '),
        problem_statements_list: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('headlines_generation', variables);
      console.log('Generated headlines prompt:', prompt);
      
      const response = await generateContent(prompt);
      console.log('Raw headlines response:', response);
      
      // Try to parse the response - handle both JSON and text formats
      let headlineData;
      try {
        headlineData = JSON.parse(response);
      } catch (jsonError) {
        console.log('Headlines response is not JSON, attempting to extract headlines...');
        
        // Extract headlines from text using various patterns
        const lines = response.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .filter(line => !line.match(/^(headline|title|option|alternative)/i));
        
        // Remove numbering and bullet points
        const headlines = lines.map(line => 
          line.replace(/^\d+\.\s*/, '')
              .replace(/^[-•*]\s*/, '')
              .replace(/^["']/, '')
              .replace(/["']$/, '')
              .trim()
        ).filter(line => line.length > 10); // Filter out short lines
        
        headlineData = { headlines: headlines.slice(0, 9) }; // Take first 9 headlines
      }
      
      console.log('Parsed headlines data:', headlineData);
      
      const headlineOptions: HeadlineOption[] = (headlineData.headlines || []).map((text: string, index: number) => ({
        id: `generated_${index}`,
        text: text.trim(),
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

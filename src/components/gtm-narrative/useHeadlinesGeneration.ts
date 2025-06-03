
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
        main_keyword: formData.targetKeyword,
        cta: formData.callToAction,
        why_publish: formData.publishReason,
        main_icp: selectedScript?.name || 'Professional audience',
        journey_stage: formData.journeyStage,
        anchors_and_types: formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; '),
        success_story_summary: formData.successStory || 'Customer transformation story',
        related_keywords_list: formData.relatedKeywords.join(', '),
        search_queries_list: formData.searchQueries.join('; '),
        problem_statements_list: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('outline_sections', variables);
      console.log('Generated outline prompt:', prompt);
      
      const response = await generateContent(prompt, {
        maxTokens: 2000,
        temperature: 0.7
      });
      console.log('Raw outline response:', response);
      
      // Extract outline sections from the response
      const outlineSections: OutlineSection[] = [];
      
      // Parse the response to extract H2 and H3 sections
      const lines = response.split('\n').filter(line => line.trim());
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check for H2 headers (## or H2:)
        if (trimmedLine.match(/^##\s+/) || trimmedLine.match(/^H2:\s*/)) {
          const title = trimmedLine.replace(/^##\s+/, '').replace(/^H2:\s*/, '').trim();
          let phase: 'attract' | 'filter' | 'engage' | 'results' = 'engage';
          
          // Determine phase based on content and position
          if (index < 2 || title.toLowerCase().includes('hook') || title.toLowerCase().includes('intro')) {
            phase = 'attract';
          } else if (title.toLowerCase().includes('filter') || title.toLowerCase().includes('who this is for')) {
            phase = 'filter';
          } else if (title.toLowerCase().includes('transform') || title.toLowerCase().includes('result') || title.toLowerCase().includes('cta')) {
            phase = 'results';
          }
          
          outlineSections.push({
            id: `section_${outlineSections.length}`,
            type: 'H2',
            title,
            phase,
            context: '',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          });
        }
        
        // Check for H3 headers (### or H3:)
        else if (trimmedLine.match(/^###\s+/) || trimmedLine.match(/^H3:\s*/)) {
          const title = trimmedLine.replace(/^###\s+/, '').replace(/^H3:\s*/, '').trim();
          const lastSection = outlineSections[outlineSections.length - 1];
          const phase = lastSection ? lastSection.phase : 'engage';
          
          outlineSections.push({
            id: `section_${outlineSections.length}`,
            type: 'H3',
            title,
            phase,
            context: '',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          });
        }
      });
      
      // If no sections were parsed, create default PLS-based outline
      if (outlineSections.length === 0) {
        const defaultSections: OutlineSection[] = [
          {
            id: 'section_0',
            type: 'H2',
            title: 'The Hook: Why This Matters Now',
            phase: 'attract',
            context: 'Opening that captures attention and establishes urgency',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          },
          {
            id: 'section_1',
            type: 'H3',
            title: 'Who This Is For (And Who It Isn\'t)',
            phase: 'filter',
            context: 'Filter for the target ICP reader',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          },
          {
            id: 'section_2',
            type: 'H2',
            title: formData.searchQueries[0] || 'The Main Challenge',
            phase: 'engage',
            context: 'Address the primary search query or problem statement',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          },
          {
            id: 'section_3',
            type: 'H3',
            title: 'The Framework That Works',
            phase: 'engage',
            context: 'Present your methodology or solution approach',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          },
          {
            id: 'section_4',
            type: 'H2',
            title: 'Real Results: How Others Succeeded',
            phase: 'results',
            context: 'Weave in success story and social proof',
            linkedAssetType: 'success_story',
            linkedAssetId: undefined
          },
          {
            id: 'section_5',
            type: 'H3',
            title: 'Your Next Step',
            phase: 'results',
            context: 'Clear call-to-action aligned with publishing goals',
            linkedAssetType: undefined,
            linkedAssetId: undefined
          }
        ];
        
        onDataChange('outlineSections', defaultSections);
      } else {
        onDataChange('outlineSections', outlineSections);
      }
      
    } catch (error) {
      console.error('Error generating outline sections:', error);
      
      // Fallback to PLS-based default sections using content discovery data
      const fallbackSections: OutlineSection[] = [
        {
          id: 'section_0',
          type: 'H2',
          title: `The ${formData.relatedKeywords[0] || 'Challenge'} Problem Everyone's Talking About`,
          phase: 'attract',
          context: 'Hook that addresses main keyword and establishes credibility',
          linkedAssetType: undefined,
          linkedAssetId: undefined
        },
        {
          id: 'section_1',
          type: 'H3',
          title: 'Why Traditional Approaches Fall Short',
          phase: 'filter',
          context: 'Filter content that qualifies the right audience',
          linkedAssetType: undefined,
          linkedAssetId: undefined
        },
        {
          id: 'section_2',
          type: 'H2',
          title: formData.searchQueries[0] || 'The Core Question You Need to Answer',
          phase: 'engage',
          context: 'Main body section addressing primary search query',
          linkedAssetType: undefined,
          linkedAssetId: undefined
        },
        {
          id: 'section_3',
          type: 'H3',
          title: formData.problemStatements[0] || 'Breaking Down the Real Problem',
          phase: 'engage',
          context: 'Supporting section addressing key problem statement',
          linkedAssetType: undefined,
          linkedAssetId: undefined
        },
        {
          id: 'section_4',
          type: 'H2',
          title: 'How [Customer] Transformed Their Results',
          phase: 'results',
          context: 'Success story integration to build credibility and urgency',
          linkedAssetType: 'success_story',
          linkedAssetId: undefined
        },
        {
          id: 'section_5',
          type: 'H3',
          title: 'What This Means for You',
          phase: 'results',
          context: 'Clear next steps and call-to-action',
          linkedAssetType: undefined,
          linkedAssetId: undefined
        }
      ];
      
      onDataChange('outlineSections', fallbackSections);
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
        success_story_summary: formData.successStory || 'Customer success transformation',
        related_keywords_list: formData.relatedKeywords.join(', '),
        search_queries_list: formData.searchQueries.join('; '),
        problem_statements_list: formData.problemStatements.join('; ')
      };

      const prompt = interpolateTemplate('headlines_generation', variables);
      console.log('Generated headlines prompt:', prompt);
      
      const response = await generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.8
      });
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
      
      // Generate outline sections after headlines are created
      await generateOutlineSections();
      
      toast({
        title: "Headlines and outline generated",
        description: "AI has created headline options and a PLS-based content outline using your discovery triggers. Review and customize as needed."
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

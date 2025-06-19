
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { FormData, HeadlineOption, OutlineSection } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UseHeadlinesGenerationProps {
  formData: FormData;
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useHeadlinesGeneration = ({ 
  formData, 
  onDataChange 
}: UseHeadlinesGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const { interpolateTemplate } = usePromptConfig();

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
      const variables = {
        trigger_or_thesis: formData.ideaTrigger || 'Strategic content initiative',
        mutual_goal: formData.mutualGoal || 'Drive engagement and conversions',
        main_keyword: formData.targetKeyword || 'product-led growth',
        cluster: formData.contentCluster || 'GTM strategy',
        why_publish: formData.publishReason || 'Establish thought leadership',
        cta: formData.callToAction || 'Contact us to learn more',
        main_icp: formData.mainTargetICP || 'Business decision makers',
        journey_stage: formData.journeyStage || 'MOFU',
        motivation: formData.readingPrompt || 'Looking for strategic insights',
        anchors_and_types: formData.narrativeAnchors?.map(a => `${a.name} (${a.type}): ${a.content}`).join('; ') || 'Key messaging points',
        success_story_summary: formData.successStory || 'Customer transformation example',
        related_keywords_list: formData.relatedKeywords?.join(', ') || 'product-led growth, customer success',
        search_queries_list: formData.searchQueries?.join(', ') || 'How to implement product-led growth',
        problem_statements_list: formData.problemStatements?.join(', ') || 'Scaling customer success challenges'
      };

      const headlinesPrompt = interpolateTemplate('frayma_headlines', variables);
      console.log('Generated headlines prompt:', headlinesPrompt);
      
      const headlinesResponse = await generateContent(headlinesPrompt);
      console.log('Raw headlines response:', headlinesResponse);
      
      // Parse headlines from response
      const headlines = headlinesResponse
        .split(/\n/)
        .map(line => line.replace(/^\d+\.\s*|^[-•]\s*/, '').trim())
        .filter(line => line && line.length > 10)
        .slice(0, 12)
        .map((text, index) => ({
          id: `generated_${Date.now()}_${index}`,
          text,
          isGenerated: true
        }));

      onDataChange('headlineOptions', headlines);
      
      // Generate outline using the outline prompt
      const outlineVariables = {
        ...variables,
        related_keywords_list: formData.relatedKeywords?.join(', ') || '',
        search_queries_list: formData.searchQueries?.join(', ') || '',
        problem_statements_list: formData.problemStatements?.join(', ') || ''
      };

      const outlinePrompt = interpolateTemplate('frayma_outline', outlineVariables);
      console.log('Generated outline prompt:', outlinePrompt);
      
      const outlineResponse = await generateContent(outlinePrompt);
      console.log('Raw outline response:', outlineResponse);
      
      // Parse outline sections
      const sections = parseOutlineResponse(outlineResponse);
      onDataChange('outlineSections', sections);
      
      toast({
        title: "Headlines and outline generated",
        description: "Headline options and content outline have been created successfully."
      });
      
    } catch (error) {
      console.error('Error generating headlines and outline:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate headlines and outline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parseOutlineResponse = (response: string): OutlineSection[] => {
    const sections: OutlineSection[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    let currentId = 1;
    
    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);
      const phaseMatch = line.match(/\*\*Phase:\s*(\w+)\*\*/i);
      
      if (h2Match) {
        const title = h2Match[1].replace(/\[|\]/g, '').trim();
        const phase = getPhaseFromContext(title);
        
        sections.push({
          id: `outline_${currentId++}`,
          type: 'H2' as const,
          title,
          context: '',
          phase,
          plsSteps: getPlsStepsForPhase(phase),
          linkedAssetType: undefined,
          linkedAssetId: undefined
        });
      } else if (h3Match && sections.length > 0) {
        const title = h3Match[1].replace(/\[|\]/g, '').trim();
        const parentPhase = sections[sections.length - 1].phase;
        
        sections.push({
          id: `outline_${currentId++}`,
          type: 'H3' as const,
          title,
          context: '',
          phase: parentPhase,
          plsSteps: getPlsStepsForPhase(parentPhase),
          linkedAssetType: undefined,
          linkedAssetId: undefined
        });
      }
    }
    
    return sections;
  };

  const getPhaseFromContext = (title: string): 'resonance' | 'relevance' | 'results' => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('hook') || lowerTitle.includes('intro') || lowerTitle.includes('filter')) {
      return 'resonance';
    }
    if (lowerTitle.includes('result') || lowerTitle.includes('success') || lowerTitle.includes('proof') || lowerTitle.includes('cta') || lowerTitle.includes('action')) {
      return 'results';
    }
    return 'relevance';
  };

  const getPlsStepsForPhase = (phase: 'resonance' | 'relevance' | 'results'): string => {
    switch (phase) {
      case 'resonance': return 'PLS Steps 2-3';
      case 'relevance': return 'PLS Steps 4-6';
      case 'results': return 'PLS Steps 7-9';
      default: return 'PLS Steps';
    }
  };

  return {
    isGenerating,
    generateHeadlines
  };
};

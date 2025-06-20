
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
      
      // Parse outline sections with the new structure
      const sections = parseOptimizedOutlineResponse(outlineResponse);
      onDataChange('outlineSections', sections);
      
      toast({
        title: "Headlines and outline generated",
        description: "Headline options and optimized content outline have been created successfully."
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

  const parseOptimizedOutlineResponse = (response: string): OutlineSection[] => {
    const sections: OutlineSection[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    let currentId = 1;
    
    // Create the optimized structure: H3 for resonance, H2+3xH3 for relevance, H2+3xH3 for results
    
    // Add first H3 for Resonance (after intro)
    sections.push({
      id: `outline_${currentId++}`,
      type: 'H3',
      title: extractFirstMeaningfulTitle(lines) || 'Getting Started with Your Solution',
      context: '',
      phase: 'resonance',
      plsSteps: 'PLS Steps 2-3',
      linkedAssetType: undefined,
      linkedAssetId: undefined
    });
    
    // Add H2 for Relevance section
    sections.push({
      id: `outline_${currentId++}`,
      type: 'H2',
      title: extractSectionTitle(lines, 'relevance') || 'Understanding the Value',
      context: '',
      phase: 'relevance',
      plsSteps: 'PLS Steps 4-6',
      linkedAssetType: undefined,
      linkedAssetId: undefined
    });
    
    // Add 3 H3s under Relevance
    const relevanceSubtitles = extractSubtitles(lines, 'relevance');
    for (let i = 0; i < 3; i++) {
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: relevanceSubtitles[i] || `Key Insight ${i + 1}`,
        context: '',
        phase: 'relevance',
        plsSteps: 'PLS Steps 4-6',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
    }
    
    // Add H2 for Results section
    sections.push({
      id: `outline_${currentId++}`,
      type: 'H2',
      title: extractSectionTitle(lines, 'results') || 'Proven Results & Next Steps',
      context: '',
      phase: 'results',
      plsSteps: 'PLS Steps 7-9',
      linkedAssetType: undefined,
      linkedAssetId: undefined
    });
    
    // Add 3 H3s under Results
    const resultsSubtitles = extractSubtitles(lines, 'results');
    for (let i = 0; i < 3; i++) {
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: resultsSubtitles[i] || `Success Factor ${i + 1}`,
        context: '',
        phase: 'results',
        plsSteps: 'PLS Steps 7-9',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
    }
    
    return sections;
  };

  const extractFirstMeaningfulTitle = (lines: string[]): string | null => {
    for (const line of lines) {
      const h3Match = line.match(/^###\s+(.+)/);
      if (h3Match) {
        return h3Match[1].replace(/\[|\]/g, '').trim();
      }
    }
    return null;
  };

  const extractSectionTitle = (lines: string[], phase: 'relevance' | 'results'): string | null => {
    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)/);
      if (h2Match) {
        const title = h2Match[1].replace(/\[|\]/g, '').trim().toLowerCase();
        if (phase === 'relevance' && (title.includes('value') || title.includes('insight') || title.includes('solution'))) {
          return h2Match[1].replace(/\[|\]/g, '').trim();
        }
        if (phase === 'results' && (title.includes('result') || title.includes('success') || title.includes('proof') || title.includes('action'))) {
          return h2Match[1].replace(/\[|\]/g, '').trim();
        }
      }
    }
    return null;
  };

  const extractSubtitles = (lines: string[], phase: 'relevance' | 'results'): string[] => {
    const subtitles: string[] = [];
    for (const line of lines) {
      const h3Match = line.match(/^###\s+(.+)/);
      if (h3Match && subtitles.length < 3) {
        subtitles.push(h3Match[1].replace(/\[|\]/g, '').trim());
      }
    }
    
    // Fill with defaults if not enough found
    while (subtitles.length < 3) {
      if (phase === 'relevance') {
        const defaults = ['How It Works', 'Key Benefits', 'Implementation Strategy'];
        subtitles.push(defaults[subtitles.length] || `Insight ${subtitles.length + 1}`);
      } else {
        const defaults = ['Success Stories', 'Measurable Impact', 'Take Action Now'];
        subtitles.push(defaults[subtitles.length] || `Result ${subtitles.length + 1}`);
      }
    }
    
    return subtitles;
  };

  return {
    isGenerating,
    generateHeadlines
  };
};

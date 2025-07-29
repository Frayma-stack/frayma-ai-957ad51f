
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { FormData, HeadlineOption, OutlineSection } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';
import { BusinessContext } from '@/types/storytelling';

interface UseHeadlinesGenerationProps {
  formData: FormData;
  productContexts?: BusinessContext[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

// Helper function to get asset details by ID
const getAssetById = (assetId: string, contextType: string, productContexts: BusinessContext[]) => {
  for (const context of productContexts) {
    if (contextType === 'feature' && context.features) {
      const asset = context.features.find(f => f.id === assetId);
      if (asset) return { name: asset.name, description: asset.description, benefits: asset.benefits?.join(', ') };
    } else if (contextType === 'useCase' && context.useCases) {
      const asset = context.useCases.find(u => u.id === assetId);
      if (asset) return { name: asset.useCase, description: asset.description };
    } else if (contextType === 'differentiator' && context.differentiators) {
      const asset = context.differentiators.find(d => d.id === assetId);
      if (asset) return { name: asset.name, description: asset.description };
    }
  }
  return null;
};

export const useHeadlinesGeneration = ({ 
  formData, 
  productContexts = [],
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
        cluster: (() => {
          let businessContextDescription = formData.businessContextItem || 'GTM strategy';
          const contextType = formData.businessContextType;
          
          if (contextType && ['feature', 'useCase', 'differentiator'].includes(contextType)) {
            businessContextDescription = `${contextType}: ${formData.businessContextItem}`;
            
            // If an asset ID is selected, find and include the specific asset details
            if (formData.businessContextAssetId && productContexts.length > 0) {
              const asset = getAssetById(formData.businessContextAssetId, contextType, productContexts);
              if (asset) {
                businessContextDescription = `${contextType}: ${asset.name} - ${asset.description}`;
                if (asset.benefits) {
                  businessContextDescription += ` [Benefits: ${asset.benefits}]`;
                }
              }
            }
          } else if (contextType) {
            businessContextDescription = `${contextType}: ${formData.businessContextItem}`;
          }
          
          return businessContextDescription;
        })(),
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
    let relevanceH2Found = false;
    let resultsH2Found = false;
    
    // Parse the AI response and extract actual sections
    for (const line of lines) {
      const h2Match = line.match(/^##\s+H2:\s*(.+)/);
      const h3Match = line.match(/^###\s+H3:\s*(.+)/);
      const phaseMatch = line.match(/\*\*Phase:\s*(\w+)\*\*/);
      
      if (h2Match) {
        const title = h2Match[1].replace(/\[|\]/g, '').trim();
        let phase: 'resonance' | 'relevance' | 'results' = 'relevance';
        let plsSteps = 'PLS Steps 4-6';
        
        // Determine phase based on content and position
        if (!relevanceH2Found) {
          phase = 'relevance';
          plsSteps = 'PLS Steps 4-6';
          relevanceH2Found = true;
        } else if (!resultsH2Found) {
          phase = 'results';
          plsSteps = 'PLS Steps 7-9';
          resultsH2Found = true;
        } else {
          phase = 'results';
          plsSteps = 'PLS Steps 7-9';
        }
        
        sections.push({
          id: `outline_${currentId++}`,
          type: 'H2',
          title,
          context: '',
          phase,
          plsSteps,
          linkedAssetType: undefined,
          linkedAssetId: undefined
        });
      } else if (h3Match) {
        const title = h3Match[1].replace(/\[|\]/g, '').trim();
        
        // Skip problematic H3s that we don't want
        if (title.toLowerCase().includes('who this') || title.toLowerCase().includes('filter subsection')) {
          continue;
        }
        
        // Determine phase based on current context
        let phase: 'resonance' | 'relevance' | 'results' = 'resonance';
        let plsSteps = 'PLS Steps 2-3';
        
        if (relevanceH2Found && !resultsH2Found) {
          phase = 'relevance';
          plsSteps = 'PLS Steps 4-6';
        } else if (resultsH2Found) {
          phase = 'results';
          plsSteps = 'PLS Steps 7-9';
        }
        
        sections.push({
          id: `outline_${currentId++}`,
          type: 'H3',
          title,
          context: '',
          phase,
          plsSteps,
          linkedAssetType: undefined,
          linkedAssetId: undefined
        });
      }
    }
    
    // If we didn't get enough sections from AI response, add minimal structure
    if (sections.length === 0) {
      // Add one H3 for resonance
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: 'Understanding Your Challenge',
        context: '',
        phase: 'resonance',
        plsSteps: 'PLS Steps 2-3',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
      
      // Add H2 for relevance
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H2',
        title: 'Solving the Problem',
        context: '',
        phase: 'relevance',
        plsSteps: 'PLS Steps 4-6',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
      
      // Add H2 for results
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H2',
        title: 'Proven Results',
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

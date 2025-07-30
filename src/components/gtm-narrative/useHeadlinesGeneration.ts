
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
      
      // Parse headlines from response and clean formatting
      const headlines = headlinesResponse
        .split(/\n/)
        .map(line => line.replace(/^\d+\.\s*|^[-•]\s*/, '').trim())
        .map(line => line.replace(/^\*+\s*|^\"+|^\*+|\*+$|\"+$|^\*|^\"|\"$|\*$/g, '').trim()) // Remove asterisks and quotes
        .filter(line => line && line.length > 10 && !line.toLowerCase().includes('here are') && !line.toLowerCase().includes('headline options') && !line.toLowerCase().includes('designed to resonate'))
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
      const sections = parseOptimizedOutlineResponse(outlineResponse, formData);
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

  const parseOptimizedOutlineResponse = (response: string, formData: FormData): OutlineSection[] => {
    let sections: OutlineSection[] = [];
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
    
    // Ensure we have the right structure - add missing sections as needed
    const hasResonanceH3 = sections.some(s => s.phase === 'resonance' && s.type === 'H3');
    const hasRelevanceH2 = sections.some(s => s.phase === 'relevance' && s.type === 'H2');
    const hasRelevanceH3s = sections.filter(s => s.phase === 'relevance' && s.type === 'H3').length;
    const hasResultsH2 = sections.some(s => s.phase === 'results' && s.type === 'H2');
    const hasResultsH3s = sections.filter(s => s.phase === 'results' && s.type === 'H3').length;
    
    // Add missing resonance H3 if needed - derive from actual data
    if (!hasResonanceH3) {
      // Generate data-driven H3 title from relevant form data
      let resonanceTitle = 'Understanding Your Challenge';
      
      // Try to extract from form data in order of priority
      const problemStatements = formData.problemStatements || [];
      const searchQueries = formData.searchQueries || [];
      const relatedKeywords = formData.relatedKeywords || [];
      const ideaTrigger = formData.ideaTrigger || '';
      const targetKeyword = formData.targetKeyword || '';
      
      // Priority 1: Use problem statements - these are most relevant for resonance
      if (problemStatements.length > 0) {
        let cleanProblem = problemStatements[0].replace(/^\*+|\*+$/g, '').trim();
        cleanProblem = cleanProblem.replace(/^(the\s+)|(a\s+)|(an\s+)/i, '').trim(); // Remove articles
        
        // Ensure it's a proper statement format
        if (cleanProblem.length > 10) {
          // If it already sounds like a challenge/problem, use as is
          if (cleanProblem.toLowerCase().includes('challenge') || 
              cleanProblem.toLowerCase().includes('problem') ||
              cleanProblem.toLowerCase().includes('struggle') ||
              cleanProblem.toLowerCase().includes('difficulty')) {
            resonanceTitle = cleanProblem.charAt(0).toUpperCase() + cleanProblem.slice(1);
          } else {
            // Make it resonate by framing as challenge
            resonanceTitle = `The ${cleanProblem.charAt(0).toUpperCase() + cleanProblem.slice(1)} Challenge`;
          }
          
          // Truncate if too long
          if (resonanceTitle.length > 60) {
            resonanceTitle = resonanceTitle.substring(0, 57) + '...';
          }
        }
      }
      // Priority 2: Use search queries that indicate pain points
      else if (searchQueries.length > 0) {
        let cleanQuery = searchQueries[0].replace(/^(how to|what is|why|when|where)\s+/i, '').trim();
        cleanQuery = cleanQuery.replace(/^\*+|\*+$/g, '').trim(); // Remove asterisks
        cleanQuery = cleanQuery.replace(/^the\s+/i, '').trim(); // Remove leading "the"
        
        if (cleanQuery.length > 8) {
          // Transform query into a resonance-focused title
          resonanceTitle = `The ${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)} Challenge`;
          
          // Clean up redundant words
          resonanceTitle = resonanceTitle.replace(/\s+challenge\s+challenge/i, ' Challenge');
        }
      }
      // Priority 3: Use target keyword to create relevant resonance
      else if (targetKeyword.length > 3) {
        let cleanKeyword = targetKeyword.replace(/^\*+|\*+$/g, '').trim();
        resonanceTitle = `Why ${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)} Matters Now`;
      }
      // Priority 4: Use idea trigger as last resort
      else if (ideaTrigger.length > 10) {
        let cleanTrigger = ideaTrigger.replace(/^\*+|\*+$/g, '').trim();
        if (cleanTrigger.length > 10) {
          resonanceTitle = cleanTrigger.substring(0, 50);
          if (!resonanceTitle.toLowerCase().includes('challenge') && 
              !resonanceTitle.toLowerCase().includes('problem')) {
            resonanceTitle = `The ${resonanceTitle} Challenge`;
          }
        }
      }
      
      sections.unshift({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: resonanceTitle,
        context: '',
        phase: 'resonance',
        plsSteps: 'PLS Steps 2-3',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
    }
    
    // Add relevance H2 if missing
    if (!hasRelevanceH2) {
      const relevanceInsertIndex = sections.findIndex(s => s.phase === 'relevance') || sections.length;
      sections.splice(relevanceInsertIndex, 0, {
        id: `outline_${currentId++}`,
        type: 'H2',
        title: 'The Solution Approach',
        context: '',
        phase: 'relevance',
        plsSteps: 'PLS Steps 4-6',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
    }
    
    // Ensure 3 relevance H3s
    const relevanceDefaults = ['How It Works', 'Key Benefits', 'Implementation Strategy'];
    for (let i = hasRelevanceH3s; i < 3; i++) {
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: relevanceDefaults[i] || `Key Insight ${i + 1}`,
        context: '',
        phase: 'relevance',
        plsSteps: 'PLS Steps 4-6',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      });
    }
    
    // Add results H2 if missing (only one)
    if (!hasResultsH2) {
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
    
    // Ensure exactly 3 results H3s and remove any extra H2s in results phase
    const resultsH2s = sections.filter(s => s.phase === 'results' && s.type === 'H2');
    const resultsH3s = sections.filter(s => s.phase === 'results' && s.type === 'H3');
    
    // Keep only the first results H2 and remove any extras
    if (resultsH2s.length > 1) {
      sections = sections.filter(s => {
        if (s.phase === 'results' && s.type === 'H2') {
          return s.id === resultsH2s[0].id; // Keep only the first one
        }
        return true;
      });
    }
    
    // Limit to exactly 3 H3s in results phase
    if (resultsH3s.length > 3) {
      sections = sections.filter(s => {
        if (s.phase === 'results' && s.type === 'H3') {
          const index = resultsH3s.findIndex(h3 => h3.id === s.id);
          return index < 3; // Keep only first 3
        }
        return true;
      });
    }
    
    const finalResultsH3s = sections.filter(s => s.phase === 'results' && s.type === 'H3').length;
    const resultsDefaults = ['Success Stories', 'Measurable Impact', 'Take Action Now'];
    for (let i = finalResultsH3s; i < 3; i++) {
      sections.push({
        id: `outline_${currentId++}`,
        type: 'H3',
        title: resultsDefaults[i] || `Result ${i + 1}`,
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

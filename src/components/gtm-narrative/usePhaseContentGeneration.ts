
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, Author, BusinessContext } from '@/types/storytelling';
import { FormData } from './useGTMNarrativeData';
import { usePromptConfig } from './usePromptConfig';

interface UsePhaseContentGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  authors?: Author[];
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

export const usePhaseContentGeneration = ({
  formData,
  scripts,
  authors = [],
  productContexts = [],
  onDataChange
}: UsePhaseContentGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const { interpolateTemplate } = usePromptConfig();

  const generatePhaseContent = async (phase: 'intro' | 'body' | 'conclusion') => {
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
      const selectedHeadline = formData.headlineOptions.find(h => h.id === formData.selectedHeadline);
      const autoCraftingConfig = formData.autoCraftingConfig;
      const selectedAuthor = autoCraftingConfig?.authorId;
      const authorData = authors.find(a => a.id === selectedAuthor);
      
      let variables: Record<string, any> = {
        // Common variables for all phases
        selected_headline: selectedHeadline?.text || 'Compelling Article Title',
        main_icp: selectedScript?.name || 'Professional audience',
        target_icp: selectedScript?.name || 'Professional audience',
        trigger_or_thesis: formData.ideaTrigger || 'Strategic content initiative',
        why_publish: formData.publishReason || 'Establish thought leadership',
        story_cta: formData.callToAction || 'Contact us to learn more',
        cta: formData.callToAction || 'Contact us to learn more',
        main_keyword: formData.targetKeyword || 'product-led growth',
        cluster: (() => {
          let businessContextDescription = formData.businessContextItem || 'GTM strategy';
          const contextType = formData.businessContextItemType;
          
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
        journey_stage: formData.journeyStage || 'MOFU',
        narrative_anchors_and_types: (() => {
          const anchors = formData.narrativeAnchors?.map(a => `${a.name} (${a.type}): ${a.content}`).join('; ') || '';
          // Include POV and outline section context
          const povContent = formData.introPOV ? `POV: ${formData.introPOV}` : '';
          const outlineSections = formData.outlineSections?.map(s => {
            let sectionData = `${s.title}`;
            if (s.context) sectionData += `: ${s.context}`;
            // Include linked asset information
            if (s.linkedAssetId && s.linkedAssetType && productContexts.length > 0) {
              const asset = getAssetById(s.linkedAssetId, s.linkedAssetType, productContexts);
              if (asset) {
                sectionData += ` [${s.linkedAssetType}: ${asset.name} - ${asset.description}]`;
              }
            }
            return sectionData;
          }).join('; ') || '';
          return [povContent, anchors, outlineSections].filter(Boolean).join('; ');
        })(),
        narrative_anchors: (() => {
          const anchors = formData.narrativeAnchors?.map(a => `${a.name} (${a.type}): ${a.content}`).join('; ') || '';
          const povContent = formData.introPOV ? `POV: ${formData.introPOV}` : '';
          return [povContent, anchors].filter(Boolean).join('; ');
        })(),
        selected_success_story_summary: formData.successStory || 'Customer transformation example',
        related_keywords: formData.relatedKeywords?.join(', ') || 'product-led growth, customer success',
        search_queries: formData.searchQueries?.join(', ') || 'How to implement product-led growth',
        problem_statements: formData.problemStatements?.join(', ') || 'Scaling challenges',
        // Author information - enhanced with proper experience/belief data
        author_name: authorData?.name || 'Industry Expert',
        author_summary: authorData?.backstory || 'Experienced professional',
        selected_writing_tone: autoCraftingConfig?.writingTone || 'Professional',
        author_writing_tone: autoCraftingConfig?.writingTone || 'Professional',
        relevant_author_experiences: (() => {
          if (!autoCraftingConfig?.experienceIds || !authorData) return [];
          const selectedExperiences = [];
          autoCraftingConfig.experienceIds.forEach(expId => {
            const experience = authorData.experiences?.find(e => e.id === expId);
            const belief = authorData.beliefs?.find(b => b.id === expId);
            if (experience) {
              selectedExperiences.push(`${experience.title}: ${experience.description || ''}`);
            }
            if (belief) {
              selectedExperiences.push(`Belief: ${belief.belief}`);
            }
          });
          return selectedExperiences.join('; ');
        })(),
        product_beliefs: authorData?.beliefs?.map(b => b.belief).join('; ') || 'Strategic insights',
        // Configuration - use actual config from auto-crafting dialog
        selected_intro_length: String(autoCraftingConfig?.introWordCount || 300),
        word_count_range: String(autoCraftingConfig?.bodyWordCount || 800),
        user_selected_word_count_range: String(autoCraftingConfig?.conclusionWordCount || 200)
      };
      
      let promptCategory: 'intro_generation' | 'body_generation' | 'conclusion_generation';
      let contentKey: keyof FormData;
      
      switch (phase) {
        case 'intro':
          promptCategory = 'intro_generation';
          contentKey = 'generatedIntro';
          variables = {
            ...variables,
            next_section_heading: formData.outlineSections.find(s => s.phase === 'resonance')?.title || 'Introduction',
            mutual_goal: formData.mutualGoal || 'Drive engagement',
            prompt_to_read: formData.readingPrompt || 'Looking for insights'
          };
          break;
          
        case 'body':
          promptCategory = 'body_generation';
          contentKey = 'generatedBody';
          variables = {
            ...variables,
            intro_text: formData.generatedIntro || 'Introduction content',
            approved_intro: formData.generatedIntro || 'Introduction content',
            queries: formData.searchQueries?.join(', ') || 'Key questions to address',
            problems: formData.problemStatements?.join(', ') || 'Problems to solve'
          };
          break;
          
        case 'conclusion':
          promptCategory = 'conclusion_generation';
          contentKey = 'generatedConclusion';
          variables = {
            ...variables,
            approved_intro: formData.generatedIntro || 'Introduction content',
            approved_main_body: formData.generatedBody || 'Main body content',
            persuade_h2: formData.outlineSections.find(s => s.phase === 'results')?.title || 'Results',
            convert_h2_or_h3: 'Take Action Now'
          };
          break;
      }

      const prompt = interpolateTemplate(promptCategory, variables);
      console.log(`Generated ${phase} prompt:`, prompt);
      
      const response = await generateContent(prompt, {
        maxTokens: phase === 'body' ? 2000 : 1000,
        temperature: 0.7
      });
      console.log(`Raw ${phase} response:`, response);
      
      // Clean up the content formatting
      const cleanedContent = cleanContentFormatting(response);
      
      onDataChange(contentKey, cleanedContent);
      
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

  // Clean up formatting for better readability
  const cleanContentFormatting = (content: string): string => {
    return content
      .replace(/#{1,6}\s*/g, '') // Remove markdown headers
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double
      .trim();
  };

  return {
    isGenerating,
    generatePhaseContent
  };
};

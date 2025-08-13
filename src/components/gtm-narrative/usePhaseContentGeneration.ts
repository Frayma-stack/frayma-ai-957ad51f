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

  const generatePhaseContent = async (phase: 'intro' | 'body' | 'conclusion' | 'full_article') => {
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
      if (phase === 'full_article') {
        // Use the new unified prompt for complete article generation
        const variables = buildFullArticleVariables();
        const prompt = interpolateTemplate('full_article_generation', variables);
        
        console.log('🤖 Generating full article with unified prompt');
        const generatedContent = await generateContent(prompt);
        
        // Store the complete generated content in generatedBody for now (until we add generatedFullArticle)
        onDataChange('generatedBody', cleanupContent(generatedContent));
        
        toast({
          title: "Complete article generated!",
          description: "Your full GTM narrative has been auto-crafted successfully."
        });
        
        return;
      }

      // Legacy phase-by-phase generation (removed since we're using unified approach)
      toast({
        title: "Legacy generation disabled",
        description: "Please use the unified article generation instead.",
        variant: "destructive"
      });
      
    } catch (error) {
      console.error(`Error generating ${phase} content:`, error);
      
      // Enhanced error logging to help debug the issue
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : String(error),
        phase,
        formData: {
          hasAutoCraftingConfig: !!formData.autoCraftingConfig,
          hasTrigger: !!formData.ideaTrigger,
          hasHeadline: !!formData.selectedHeadline
        }
      });
      
      toast({
        title: "Generation failed",
        description: `Failed to generate ${phase} content. Error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const buildFullArticleVariables = () => {
    // Build comprehensive variables for the unified full article prompt
    const selectedAuthor = authors.find(a => a.id === formData.articleAuthor);
    
    const variables = {
      // Section-specific context from the Content Architecture
      section_specific_context: buildSectionSpecificContext(),
      
      // Word count guidelines from config
      intro_length: formData.autoCraftingConfig?.introWordCount || 300,
      body_length: formData.autoCraftingConfig?.bodyWordCount || 1200,
      conclusion_length: formData.autoCraftingConfig?.conclusionWordCount || 400,
      
      // Strategic alignment
      trigger_or_thesis: formData.ideaTrigger || '',
      mutual_goal: formData.mutualGoal || '',
      main_keyword: formData.targetKeyword || '',
      cluster: formData.businessContextItem || '',
      why_publish: formData.publishReason || '',
      cta: formData.callToAction || '',
      
      // Target reader profile
      main_icp: formData.mainTargetICP || '',
      journey_stage: formData.journeyStage || '',
      broader_audience: formData.broaderAudience || '',
      motivation: formData.readingPrompt || '',
      anchors_and_types: formData.narrativeAnchors?.map(a => `${a.type}: ${a.content}`).join(', ') || '',
      success_story_summary: formData.successStory || '',
      
      // Content discovery
      related_keywords_list: Array.isArray(formData.relatedKeywords) ? formData.relatedKeywords.join(', ') : (formData.relatedKeywords || ''),
      search_queries_list: Array.isArray(formData.searchQueries) ? formData.searchQueries.join(', ') : (formData.searchQueries || ''),
      problem_statements_list: Array.isArray(formData.problemStatements) ? formData.problemStatements.join(', ') : (formData.problemStatements || ''),
      
      // Author details
      author_name: selectedAuthor?.name || '',
      author_title: selectedAuthor?.title || '',
      author_organization: selectedAuthor?.organization || '',
      author_backstory: selectedAuthor?.backstory || '',
      author_experiences: selectedAuthor?.experiences?.map(e => e.title).join('; ') || '',
      author_writing_tones: selectedAuthor?.tones?.map(t => `${t.tone}: ${t.description || ''}`).join('; ') || '',
      author_product_beliefs: selectedAuthor?.beliefs?.map(b => `${b.belief}: ${b.description || ''}`).join('; ') || '',
      
      // Business context
      business_context_items: buildBusinessContextSummary(),
      
      // Selected headline
      selected_headline: formData.selectedHeadline || ''
    };
    
    return variables;
  };

  const buildSectionSpecificContext = () => {
    // Build the section-specific context string that maps Business Context Items, POVs, and credibility to specific headers
    if (!formData.outlineSections || formData.outlineSections.length === 0) {
      return 'No outline sections defined';
    }
    
    let contextString = '';
    
    formData.outlineSections.forEach((section, index) => {
      contextString += `### ${section.title}\n`;
      
      if (section.linkedAssetId) {
        contextString += `- Linked Business Context Items: ${section.linkedAssetId}\n`;
      }
      
      if (section.context) {
        contextString += `- Section Context: ${section.context}\n`;
      }
      
      contextString += '\n';
    });
    
    return contextString;
  };

  const buildBusinessContextSummary = () => {
    if (!productContexts || productContexts.length === 0) return '';
    
    let summary = '';
    
    productContexts.forEach(context => {
      if (context.features && context.features.length > 0) {
        summary += `Features: ${context.features.map(f => `${f.name} - ${f.description}`).join(', ')}; `;
      }
      if (context.useCases && context.useCases.length > 0) {
        summary += `Use Cases: ${context.useCases.map(u => `${u.useCase} - ${u.description}`).join(', ')}; `;
      }
      if (context.differentiators && context.differentiators.length > 0) {
        summary += `Differentiators: ${context.differentiators.map(d => `${d.name} - ${d.description}`).join(', ')}; `;
      }
    });
    
    return summary;
  };

  const cleanupContent = (content: string): string => {
    return content
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double
      .trim();
  };

  return {
    isGenerating,
    generatePhaseContent
  };
};

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { FormData, HeadlineOption, OutlineSection } from './useGTMNarrativeData';

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
      
      const prompt = `Based on the following GTM narrative piece information, suggest relevant content discovery triggers:

STRATEGIC ALIGNMENT:
- Idea/Trigger: ${formData.ideaTrigger}
- Mutual Goal: ${formData.mutualGoal}
- Target Keyword: ${formData.targetKeyword}
- Content Cluster: ${formData.contentCluster}
- Publish Reason: ${formData.publishReason}
- Call to Action: ${formData.callToAction}
- Strategic Success Story: ${strategicSuccessStory ? `${strategicSuccessStory.title} - Before: ${strategicSuccessStory.beforeSummary} - After: ${strategicSuccessStory.afterSummary}` : 'Not selected'}

TARGET READER RESONANCE:
- Main Target ICP: ${selectedScript?.name || 'Not selected'}
- Journey Stage: ${formData.journeyStage}
- Reading Prompt: ${formData.readingPrompt}
- Narrative Anchors: ${formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; ')}
- Success Story: ${selectedSuccessStory?.title || 'Not selected'}

Please provide:
1. 5-8 related keywords to "${formData.targetKeyword}"
2. 3-5 real search queries that the target audience would use
3. 3-5 specific problem statements that the piece should address

Format your response as JSON with the following structure:
{
  "relatedKeywords": ["keyword1", "keyword2", ...],
  "searchQueries": ["query1", "query2", ...],
  "problemStatements": ["statement1", "statement2", ...]
}`;

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
      
      const prompt = `Based on the following strategic inputs, generate 9-12 compelling headline alternatives:

STRATEGIC CONTEXT:
- Core Idea: ${formData.ideaTrigger}
- Target Keyword: ${formData.targetKeyword}
- Target Audience: ${selectedScript?.name || 'Professional audience'}
- Journey Stage: ${formData.journeyStage}
- Mutual Goal: ${formData.mutualGoal}

DISCOVERY TRIGGERS:
- Related Keywords: ${formData.relatedKeywords.join(', ')}
- Problem Statements: ${formData.problemStatements.join('; ')}

Create headlines that are:
1. Compelling and attention-grabbing
2. Include the target keyword naturally
3. Speak directly to the target audience's challenges
4. Promise a clear value proposition

Format as JSON:
{
  "headlines": ["headline1", "headline2", ...]
}`;

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
      
      const prompt = `Create a detailed Product-Led Storytelling outline with the 9-step approach organized into 3Rs phases:

CONTEXT:
- Core Idea: ${formData.ideaTrigger}
- Target Audience: ${selectedScript?.name || 'Professional audience'}
- Problems to Address: ${formData.problemStatements.join('; ')}

Create sections following this structure:
- ATTRACT (PLS Step 1): H2/H3 for hook and resonance
- FILTER (PLS Steps 2-3): H2/H3 for context and transition  
- ENGAGE (PLS Steps 4-6): H2/H3/H4 for main content body
- RESULTS (PLS Steps 7-9): H2/H3/H4 for outcomes and CTA

Format as JSON:
{
  "sections": [
    {
      "type": "H2",
      "title": "Section Title",
      "phase": "attract|filter|engage|results"
    }
  ]
}`;

      const response = await generateContent(prompt);
      const outlineData = JSON.parse(response);
      
      const outlineSections: OutlineSection[] = outlineData.sections.map((section: any, index: number) => ({
        id: `section_${index}`,
        type: section.type,
        title: section.title,
        phase: section.phase,
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
      
      let phasePrompt = '';
      let contentKey: keyof FormData = 'generatedIntro';
      
      switch (phase) {
        case 'intro':
          contentKey = 'generatedIntro';
          phasePrompt = `Generate a compelling introduction and first section content for:
          
HEADLINE: ${selectedHeadline?.text}
TARGET AUDIENCE: ${selectedScript?.name}
CORE IDEA: ${formData.ideaTrigger}

Include:
1. Hook that resonates with the target audience
2. Introduction of the problem/challenge
3. Personal connection or credibility
4. Preview of what's coming`;
          break;
          
        case 'body':
          contentKey = 'generatedBody';
          phasePrompt = `Generate the main body content following the outline sections for ENGAGE phase:

SECTIONS: ${formData.outlineSections.filter(s => s.phase === 'engage').map(s => s.title).join(', ')}
CONTEXT: ${formData.outlineSections.filter(s => s.phase === 'engage' && s.context).map(s => s.context).join('; ')}

Focus on:
1. Core framework/solution presentation
2. Detailed explanation with examples
3. Value demonstration
4. Practical application`;
          break;
          
        case 'conclusion':
          contentKey = 'generatedConclusion';
          phasePrompt = `Generate the conclusion content for RESULTS phase:

SECTIONS: ${formData.outlineSections.filter(s => s.phase === 'results').map(s => s.title).join(', ')}
CALL TO ACTION: ${formData.callToAction}

Include:
1. Summary of key points
2. Results and benefits
3. Future implications
4. Clear call to action`;
          break;
      }

      const fullPrompt = `${phasePrompt}

Write comprehensive, engaging content that aligns with the overall narrative strategy.`;

      const response = await generateContent(fullPrompt);
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

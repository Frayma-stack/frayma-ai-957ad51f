
import { useToast } from "@/components/ui/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useContentGeneration } from './useContentGeneration';

interface UseShortFormContentGenerationProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  narrativeSelections: NarrativeSelection[];
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedSuccessStory: string;
  contentGoal: ContentGoal;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
  getSelectedIdea: () => GeneratedIdea | null;
  isFormValid: () => boolean;
}

export const useShortFormContentGeneration = ({
  contentType,
  scripts,
  authors,
  successStories,
  narrativeSelections,
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedSuccessStory,
  contentGoal,
  wordCount,
  emailCount,
  additionalContext,
  triggerInput,
  setIsGenerating,
  setGeneratedContent,
  getSelectedIdea,
  isFormValid
}: UseShortFormContentGenerationProps) => {
  const { toast } = useToast();
  const { generateContent: generateWithChatGPT, isConfigured } = useChatGPT();

  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getSelectedNarrativeContents
  } = useContentGeneration({
    contentType,
    scripts,
    authors,
    successStories,
    narrativeSelections,
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedSuccessStory,
    contentGoal,
    wordCount,
    emailCount,
    additionalContext,
    triggerInput
  });

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  const buildPrompt = () => {
    const script = getSelectedICPScript();
    const author = getSelectedAuthor();
    const successStory = getSelectedSuccessStory();
    const selectedIdea = getSelectedIdea();
    const narrativeContents = getSelectedNarrativeContents();

    let prompt = `You are an expert GTM narrative writer creating compelling, high-converting ${contentType} content.\n\n`;

    // Content type specific instructions
    if (contentType === 'linkedin') {
      prompt += `Create a LinkedIn post that:
- Uses engaging storytelling to capture attention
- Includes relevant hashtags and professional tone
- Has a clear call-to-action
- Is approximately ${wordCount} words
- Uses LinkedIn best practices for engagement\n\n`;
    } else if (contentType === 'email') {
      prompt += `Create a ${emailCount}-email sequence that:
- Uses compelling subject lines
- Builds trust and credibility
- Addresses pain points directly
- Has clear calls-to-action
- Follows email marketing best practices\n\n`;
    } else {
      prompt += `Create custom content that:
- Is approximately ${wordCount} words
- Uses compelling storytelling
- Has a clear call-to-action
- Addresses the target audience's needs\n\n`;
    }

    // Add trigger/idea context
    if (triggerInput) {
      prompt += `CONTENT TRIGGER/THESIS:\n${triggerInput}\n\n`;
    } else if (selectedIdea) {
      prompt += `CONTENT IDEA:\nTitle: ${selectedIdea.title}\nNarrative: ${selectedIdea.narrative}\n`;
      if (selectedIdea.productTieIn) {
        prompt += `Product Tie-in: ${selectedIdea.productTieIn}\n`;
      }
      if (selectedIdea.cta) {
        prompt += `CTA: ${selectedIdea.cta}\n`;
      }
      prompt += '\n';
    }

    // Add ICP context
    if (script) {
      prompt += `TARGET ICP: ${script.name}\n`;
      if (script.demographics) {
        prompt += `ICP Demographics: ${script.demographics}\n`;
      }
      prompt += '\n';
    }

    // Add narrative anchors
    if (narrativeContents.length > 0) {
      prompt += `NARRATIVE ANCHORS TO INCORPORATE:\n`;
      narrativeContents.forEach((content, index) => {
        prompt += `${index + 1}. ${content}\n`;
      });
      prompt += '\n';
    }

    // Add author context
    if (author) {
      prompt += `AUTHOR CONTEXT:\n`;
      prompt += `Name: ${author.name}\n`;
      if (author.title) prompt += `Title: ${author.title}\n`;
      if (author.organization) prompt += `Organization: ${author.organization}\n`;
      if (author.backstory) prompt += `Background: ${author.backstory}\n`;
      
      // Add tone and experience
      if (selectedAuthorTone && author.tones) {
        const tone = author.tones.find(t => t.id === selectedAuthorTone);
        if (tone) prompt += `Writing Tone: ${tone.tone} - ${tone.description}\n`;
      }
      if (selectedAuthorExperience && author.experiences) {
        const experience = author.experiences.find(e => e.id === selectedAuthorExperience);
        if (experience) prompt += `Experience Context: ${experience.title} - ${experience.description}\n`;
      }
      prompt += '\n';
    }

    // Add success story
    if (successStory) {
      prompt += `SUCCESS STORY TO REFERENCE:\n`;
      prompt += `Title: ${successStory.title}\n`;
      prompt += `Before: ${successStory.beforeSummary}\n`;
      prompt += `After: ${successStory.afterSummary}\n`;
      if (successStory.quotes.length > 0) {
        prompt += `Quote: "${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}\n`;
      }
      prompt += '\n';
    }

    // Add content goal
    prompt += `CONTENT GOAL: ${contentGoal.description}\n\n`;

    // Add additional context
    if (additionalContext && !additionalContext.startsWith('Based on saved idea:')) {
      prompt += `ADDITIONAL CONTEXT:\n${additionalContext}\n\n`;
    }

    prompt += `INSTRUCTIONS:
1. Write engaging, narrative-driven content that resonates with the target audience
2. Incorporate the narrative anchors naturally into the story
3. Use the author's voice and expertise authentically
4. Include specific, actionable insights
5. End with a compelling call-to-action aligned with the content goal
6. Make it feel personal and credible, not templated
7. Use storytelling techniques to build engagement

Write the complete ${contentType} content now:`;

    return prompt;
  };

  const generateContent = async () => {
    console.log('🔄 Starting AI-powered content generation...');
    
    if (!isFormValid()) {
      const selectedIdea = getSelectedIdea();
      if (triggerInput.trim()) {
        toast({
          title: "Missing information",
          description: "Please select an author to generate content using your trigger.",
          variant: "destructive"
        });
      } else if (selectedIdea) {
        toast({
          title: "Missing information",
          description: "Please select an author to generate content using your saved idea.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Missing information",
          description: "Please select an ICP, author, and at least one narrative item to generate content.",
          variant: "destructive"
        });
      }
      return;
    }

    if (!isConfigured) {
      toast({
        title: "ChatGPT not configured",
        description: "Please configure your ChatGPT API key to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    console.log('🎯 AI content generation started');

    try {
      const prompt = buildPrompt();
      console.log('📝 Generated prompt for AI:', prompt.substring(0, 200) + '...');
      
      const generatedContent = await generateWithChatGPT(prompt, {
        maxTokens: contentType === 'email' ? 3000 : 2000,
        temperature: 0.7
      });
      
      console.log('✅ AI content generated successfully:', {
        contentLength: generatedContent.length,
        contentPreview: generatedContent.substring(0, 100) + '...'
      });
      
      if (!generatedContent || generatedContent.trim().length === 0) {
        throw new Error('Generated content was empty');
      }
      
      setGeneratedContent(generatedContent);
      
      toast({
        title: `${getContentTypeLabel()} generated successfully!`,
        description: "Your AI-powered content is ready for editing. It will be automatically saved as a draft.",
      });
      
    } catch (error) {
      console.error('❌ AI content generation error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "There was an error generating your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    getContentTypeLabel
  };
};

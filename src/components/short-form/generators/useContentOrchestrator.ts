
import { useToast } from "@/components/ui/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ContentType } from '../types';

interface ContentOrchestratorProps {
  contentType: ContentType;
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
  isFormValid: () => boolean;
  getValidationMessage: () => string;
  buildPrompt: () => string;
  getContentTypeLabel: () => string;
}

export const useContentOrchestrator = ({
  contentType,
  setIsGenerating,
  setGeneratedContent,
  isFormValid,
  getValidationMessage,
  buildPrompt,
  getContentTypeLabel
}: ContentOrchestratorProps) => {
  const { toast } = useToast();
  const { generateContent: generateWithChatGPT, isConfigured } = useChatGPT();

  const generateContent = async () => {
    console.log('🔄 Starting AI-powered content generation...');
    
    if (!isFormValid()) {
      toast({
        title: "Missing information",
        description: getValidationMessage(),
        variant: "destructive"
      });
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
    generateContent
  };
};

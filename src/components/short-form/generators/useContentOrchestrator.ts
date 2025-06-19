
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '../types';

interface UseContentOrchestratorProps {
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
}: UseContentOrchestratorProps) => {
  const generateContent = useCallback(async () => {
    console.log('🚀 Starting content generation for:', contentType);
    
    try {
      if (!isFormValid()) {
        const validationMessage = getValidationMessage();
        console.log('❌ Form validation failed:', validationMessage);
        toast.error(validationMessage);
        return;
      }

      setIsGenerating(true);
      setGeneratedContent('');
      
      console.log('✅ Form validation passed, building prompt...');
      const prompt = buildPrompt();
      
      if (!prompt) {
        console.log('❌ No prompt generated');
        toast.error('Failed to generate prompt for content creation');
        return;
      }

      console.log('📝 Prompt built, making API call...');
      console.log('Prompt length:', prompt.length);

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { 
          prompt,
          maxTokens: 1500,
          temperature: 0.7
        }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data?.content) {
        console.error('❌ No content in response:', data);
        throw new Error('No content received from AI service');
      }

      console.log('✅ Content generated successfully');
      console.log('Content length:', data.content.length);
      
      setGeneratedContent(data.content);
      toast.success(`${getContentTypeLabel()} generated successfully!`);
      
    } catch (error) {
      console.error('❌ Content generation error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to generate content. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('OpenAI API key')) {
          errorMessage = 'OpenAI API key not configured. Please contact support.';
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'API rate limit reached. Please try again in a few minutes.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [
    contentType,
    isFormValid,
    getValidationMessage,
    buildPrompt,
    getContentTypeLabel,
    setIsGenerating,
    setGeneratedContent
  ]);

  return { generateContent };
};

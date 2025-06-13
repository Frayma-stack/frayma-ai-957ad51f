
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';

export const useIdeaGeneration = () => {
  const { toast } = useToast();
  const { generateContent } = useChatGPT();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);

  const generateIdeas = async (prompt: string): Promise<string[]> => {
    setIsGenerating(true);
    try {
      console.log('💡 Starting idea generation process...');
      
      console.log('💡 Built prompt with length:', prompt.length);
      
      const response = await generateContent(prompt);
      console.log('💡 Received response:', response ? 'Success' : 'Empty response');
      
      if (!response || typeof response !== 'string') {
        console.error('💡 Invalid response received:', response);
        throw new Error('Invalid response received from content generation');
      }

      if (response.trim() === '') {
        console.error('💡 Empty response content');
        throw new Error('Empty content received from generation');
      }
      
      const ideas = response.split(/(?=Title[\s\-–:]+)/i).filter(idea => idea.trim() !== '');
      console.log('💡 Parsed ideas count:', ideas.length);
      
      if (ideas.length === 0) {
        throw new Error('No valid ideas could be parsed from the response');
      }
      
      setGeneratedIdeas(ideas);
      
      toast({
        title: "Ideas Generated",
        description: `Generated ${ideas.length} Product-Led Storytelling ideas.`,
      });

      return ideas;
      
    } catch (error) {
      console.error("💡 Error generating ideas:", error);
      
      let errorMessage = "Failed to generate ideas. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('API request failed')) {
          errorMessage = "API connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes('Empty response')) {
          errorMessage = "No content was generated. Please try rephrasing your trigger or reducing the complexity.";
        } else if (error.message.includes('JSON')) {
          errorMessage = "Response parsing failed. Please try again or contact support if the issue persists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateIdeas = async (prompt: string): Promise<string[]> => {
    setIsGenerating(true);
    
    try {
      console.log('💡 Starting idea regeneration with new direction...');
      
      console.log('💡 Built regeneration prompt with length:', prompt.length);
      
      const response = await generateContent(prompt);
      console.log('💡 Received regeneration response:', response ? 'Success' : 'Empty response');
      
      if (!response || typeof response !== 'string') {
        console.error('💡 Invalid response received:', response);
        throw new Error('Invalid response received from content regeneration');
      }

      if (response.trim() === '') {
        console.error('💡 Empty response content');
        throw new Error('Empty content received from regeneration');
      }
      
      const ideas = response.split(/(?=Title[\s\-–:]+)/i).filter(idea => idea.trim() !== '');
      console.log('💡 Parsed regenerated ideas count:', ideas.length);
      
      if (ideas.length === 0) {
        throw new Error('No valid ideas could be parsed from the regeneration response');
      }
      
      setGeneratedIdeas(ideas);
      
      toast({
        title: "Ideas Regenerated",
        description: `Generated ${ideas.length} new ideas based on your direction.`,
      });

      return ideas;
      
    } catch (error) {
      console.error("💡 Error regenerating ideas:", error);
      
      let errorMessage = "Failed to regenerate ideas. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('API request failed')) {
          errorMessage = "API connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes('Empty response')) {
          errorMessage = "No content was generated. Please try rephrasing your direction.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Regeneration Failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedIdeas,
    setGeneratedIdeas,
    generateIdeas,
    regenerateIdeas
  };
};

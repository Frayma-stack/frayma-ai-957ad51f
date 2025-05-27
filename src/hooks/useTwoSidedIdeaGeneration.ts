
import { useState } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';

interface UseTwoSidedIdeaGenerationProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
}

export const useTwoSidedIdeaGeneration = ({
  icpScripts,
  productContext
}: UseTwoSidedIdeaGenerationProps) => {
  const [prompt, setPrompt] = useState('');
  const [selectedICPScript, setSelectedICPScript] = useState<ICPStoryScript | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (value: string) => {
    setPrompt(value);
  };

  const handleICPScriptChange = (scriptId: string) => {
    const script = icpScripts.find(s => s.id === scriptId) || null;
    setSelectedICPScript(script);
  };

  const generateIdeas = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Mock generation for now - in a real app this would call an AI service
      const mockIdeas = [
        `Idea 1: ${prompt} - Focus on problem solving approach`,
        `Idea 2: ${prompt} - Highlight unique value proposition`,
        `Idea 3: ${prompt} - Address common misconceptions`,
        `Idea 4: ${prompt} - Share success story framework`,
        `Idea 5: ${prompt} - Provide actionable steps`
      ];
      
      setGeneratedIdeas(mockIdeas);
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    prompt,
    selectedICPScript,
    generatedIdeas,
    isGenerating,
    handleInputChange,
    handleICPScriptChange,
    generateIdeas
  };
};

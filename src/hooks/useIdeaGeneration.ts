
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { IdeaGenerationPrompt } from '@/types/ideas';
import { ICPStoryScript, CustomerSuccessStory, ProductContext, Author } from '@/types/storytelling';

interface UseIdeaGenerationProps {
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  authors: Author[];
}

export const useIdeaGeneration = ({
  icpScripts,
  successStories,
  productContexts,
  authors,
}: UseIdeaGenerationProps) => {
  const [prompt, setPrompt] = useState<IdeaGenerationPrompt>({
    topic: '',
    targetAudience: '',
    keywords: '',
    tone: '',
    style: '',
    successStoryId: '',
    icpScriptId: '',
    productContextId: '',
    authorId: '',
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { generateContent } = useChatGPT();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  const buildPrompt = (): string => {
    let fullPrompt = `Generate 5 content ideas about ${prompt.topic}.`;

    if (prompt.targetAudience) {
      fullPrompt += ` Target audience: ${prompt.targetAudience}.`;
    }
    if (prompt.keywords) {
      fullPrompt += ` Keywords: ${prompt.keywords}.`;
    }
    if (prompt.tone) {
      fullPrompt += ` Tone: ${prompt.tone}.`;
    }
    if (prompt.style) {
      fullPrompt += ` Style: ${prompt.style}.`;
    }

    // Add context from selected items
    if (prompt.successStoryId) {
      const story = successStories.find(s => s.id === prompt.successStoryId);
      if (story) {
        fullPrompt += ` Incorporate elements from the success story: ${story.title} - ${story.beforeSummary} to ${story.afterSummary}.`;
      }
    }
    if (prompt.icpScriptId) {
      const icp = icpScripts.find(icp => icp.id === prompt.icpScriptId);
      if (icp) {
        fullPrompt += ` Align with the ideal customer profile: ${icp.name} - Core Beliefs: ${icp.coreBeliefs.map(b => b.content).join(', ')}.`;
      }
    }
    if (prompt.productContextId) {
      const product = productContexts.find(p => p.id === prompt.productContextId);
      if (product) {
        fullPrompt += ` Highlight aspects of the product context: ${product.categoryPOV} - ${product.companyMission}.`;
      }
    }
    if (prompt.authorId) {
      const author = authors.find(a => a.id === prompt.authorId);
      if (author) {
        fullPrompt += ` Write in the style of ${author.name} - ${author.backstory}.`;
      }
    }

    return fullPrompt;
  };

  const handleGenerateIdeas = async () => {
    if (!prompt.topic) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fullPrompt = buildPrompt();
      const response = await generateContent(fullPrompt);
      if (response) {
        const ideas = response.split('\n').filter(idea => idea.trim() !== '');
        setGeneratedIdeas(ideas);
      } else {
        toast({
          title: "Idea Generation Failed",
          description: "Failed to generate ideas. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Idea Generation Error",
        description: "An error occurred while generating ideas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIdea = (ideaToDelete: string) => {
    setGeneratedIdeas(prev => prev.filter(idea => idea !== ideaToDelete));
  };

  const handleEditIdea = (originalIdea: string, editedIdea: string) => {
    setGeneratedIdeas(prev =>
      prev.map(idea => (idea === originalIdea ? editedIdea : idea))
    );
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The idea has been copied to your clipboard.",
    });
  };

  const clearAllIdeas = () => {
    setGeneratedIdeas([]);
  };

  return {
    prompt,
    generatedIdeas,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleGenerateIdeas,
    handleDeleteIdea,
    handleEditIdea,
    handleCopyToClipboard,
    clearAllIdeas,
  };
};

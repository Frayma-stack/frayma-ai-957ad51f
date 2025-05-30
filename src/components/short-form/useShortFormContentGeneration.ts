
import { useToast } from "@/components/ui/use-toast";
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

  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
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

  const generateContent = () => {
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

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = getSelectedAuthor();
      const successStory = getSelectedSuccessStory();
      const selectedIdea = getSelectedIdea();
      
      if (!author) {
        setIsGenerating(false);
        return;
      }
      
      let content = "";
      
      if (contentType === 'email') {
        content = generateEmailContent(script, author, successStory, selectedIdea, triggerInput);
      } else if (contentType === 'linkedin') {
        content = generateLinkedInContent(script, author, successStory, selectedIdea, triggerInput);
      } else if (contentType === 'custom') {
        content = generateCustomContent(script, author, successStory, selectedIdea, triggerInput);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: `${getContentTypeLabel()} generated`,
        description: "Your content has been created. Feel free to edit it as needed."
      });
    }, 1500);
  };

  return {
    generateContent,
    getContentTypeLabel
  };
};

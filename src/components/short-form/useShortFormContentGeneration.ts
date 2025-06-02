
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
    console.log('🔄 Starting content generation...');
    
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
    console.log('🎯 Content generation started, isGenerating set to true');

    // Simulate content generation with a more realistic delay
    setTimeout(() => {
      try {
        const script = getSelectedICPScript();
        const author = getSelectedAuthor();
        const successStory = getSelectedSuccessStory();
        const selectedIdea = getSelectedIdea();
        
        console.log('📝 Generating content with data:', {
          hasScript: !!script,
          hasAuthor: !!author,
          hasSuccessStory: !!successStory,
          hasSelectedIdea: !!selectedIdea,
          contentType,
          triggerInput: triggerInput.substring(0, 50) + '...'
        });
        
        if (!author) {
          console.error('❌ No author found for content generation');
          setIsGenerating(false);
          toast({
            title: "Generation failed",
            description: "Author information is required for content generation.",
            variant: "destructive"
          });
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
        
        console.log('✅ Content generated successfully:', {
          contentLength: content.length,
          contentPreview: content.substring(0, 100) + '...'
        });
        
        // Set the generated content
        setGeneratedContent(content);
        setIsGenerating(false);
        
        // Show success message
        toast({
          title: `${getContentTypeLabel()} generated successfully!`,
          description: "Your content is ready for editing. It will be automatically saved as a draft.",
        });
        
      } catch (error) {
        console.error('❌ Content generation error:', error);
        setIsGenerating(false);
        toast({
          title: "Generation failed",
          description: "There was an error generating your content. Please try again.",
          variant: "destructive"
        });
      }
    }, 2000); // 2 second delay to simulate generation
  };

  return {
    generateContent,
    getContentTypeLabel
  };
};

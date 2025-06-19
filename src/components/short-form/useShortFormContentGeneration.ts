
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { usePromptBuilder } from './generators/usePromptBuilder';
import { useContentValidator } from './generators/useContentValidator';
import { useContentOrchestrator } from './generators/useContentOrchestrator';

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

export const useShortFormContentGeneration = (props: UseShortFormContentGenerationProps) => {
  console.log('🔧 useShortFormContentGeneration initialized for:', props.contentType);
  
  const { buildPrompt } = usePromptBuilder(props);
  
  const { isFormValid: validateForm, getValidationMessage } = useContentValidator({
    selectedICP: props.selectedICP,
    selectedAuthor: props.selectedAuthor,
    narrativeSelections: props.narrativeSelections,
    triggerInput: props.triggerInput,
    getSelectedIdea: props.getSelectedIdea
  });

  const getContentTypeLabel = () => {
    switch (props.contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  const { generateContent } = useContentOrchestrator({
    contentType: props.contentType,
    setIsGenerating: props.setIsGenerating,
    setGeneratedContent: props.setGeneratedContent,
    isFormValid: validateForm,
    getValidationMessage,
    buildPrompt,
    getContentTypeLabel
  });

  return {
    generateContent,
    getContentTypeLabel
  };
};

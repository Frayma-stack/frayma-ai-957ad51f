
import { GeneratedIdea } from '@/types/ideas';

interface ContentValidatorProps {
  selectedICP: string;
  selectedAuthor: string;
  narrativeSelections: any[];
  triggerInput: string;
  getSelectedIdea: () => GeneratedIdea | null;
}

export const useContentValidator = ({
  selectedICP,
  selectedAuthor,
  narrativeSelections,
  triggerInput,
  getSelectedIdea
}: ContentValidatorProps) => {
  const isFormValid = () => {
    const selectedIdea = getSelectedIdea();
    if (triggerInput.trim()) {
      return Boolean(selectedAuthor);
    } else if (selectedIdea) {
      return Boolean(selectedAuthor);
    } else {
      return Boolean(selectedICP && selectedAuthor && narrativeSelections.length > 0);
    }
  };

  const getValidationMessage = () => {
    const selectedIdea = getSelectedIdea();
    if (triggerInput.trim()) {
      return "Please select an author to generate content using your trigger.";
    } else if (selectedIdea) {
      return "Please select an author to generate content using your saved idea.";
    } else {
      return "Please select an ICP, author, and at least one narrative item to generate content.";
    }
  };

  return {
    isFormValid,
    getValidationMessage
  };
};

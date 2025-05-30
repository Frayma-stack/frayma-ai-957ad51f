import { NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface UseShortFormValidationProps {
  selectedICP: string;
  selectedAuthor: string;
  narrativeSelections: NarrativeSelection[];
  triggerInput: string;
  getSelectedIdea: () => GeneratedIdea | null;
}

export const useShortFormValidation = ({
  selectedICP,
  selectedAuthor,
  narrativeSelections,
  triggerInput,
  getSelectedIdea
}: UseShortFormValidationProps) => {
  const isFormValid = (): boolean => {
    // If we have a trigger input, we need at least an author
    if (triggerInput.trim()) {
      return Boolean(selectedAuthor);
    }
    
    // If an idea is selected, we don't need ICP and narrative selections
    if (getSelectedIdea()) {
      return Boolean(selectedAuthor);
    }
    
    // Otherwise, we need the full form
    if (!selectedICP || !selectedAuthor) return false;
    
    const hasSelectedItems = narrativeSelections.some(
      selection => selection.items.length > 0
    );
    
    return hasSelectedItems;
  };

  return {
    isFormValid
  };
};

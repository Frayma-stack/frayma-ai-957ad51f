
import { useCallback } from 'react';

interface UseShortFormValidationProps {
  selectedICP: string;
  triggerInput: string;
  selectedIdeaId: string | null;
}

export const useShortFormValidation = ({
  selectedICP,
  triggerInput,
  selectedIdeaId
}: UseShortFormValidationProps) => {
  const isFormValid = useCallback(() => {
    if (!selectedICP) return false;
    if (!triggerInput && !selectedIdeaId) return false;
    return true;
  }, [selectedICP, triggerInput, selectedIdeaId]);

  return { isFormValid };
};

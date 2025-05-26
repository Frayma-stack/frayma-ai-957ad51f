
import { Author } from '@/types/storytelling';
import { useAuthorAnalysisIntegration } from './useAuthorAnalysisIntegration';
import { useAuthorFormValidation } from './useAuthorFormValidation';

export const useAuthorFormActions = (
  currentAuthor: Author,
  handleInputChange: (field: any, value: string) => void,
  setExperiencesFromAnalysis: (experiences: any[]) => void,
  setTonesFromAnalysis: (tones: any[]) => void,
  setBeliefsFromAnalysis: (beliefs: any[]) => void
) => {
  // Handle analysis integration
  const { handleAuthorAnalysisResult } = useAuthorAnalysisIntegration(
    handleInputChange,
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  // Handle validation
  const { validateAndCleanAuthor } = useAuthorFormValidation(currentAuthor);

  return {
    handleAuthorAnalysisResult,
    validateAndCleanAuthor
  };
};

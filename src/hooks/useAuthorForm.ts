
import { Author } from '@/types/storytelling';
import { useAuthorFormState } from './useAuthorFormState';
import { useAuthorFormActions } from './useAuthorFormActions';

export const useAuthorForm = (initialAuthor?: Author | null) => {
  const {
    currentAuthor,
    handleInputChange,
    handleExperienceChange,
    addExperience,
    removeExperience,
    handleToneChange,
    addTone,
    removeTone,
    handleBeliefChange,
    addBelief,
    removeBelief,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink,
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  } = useAuthorFormState(initialAuthor);

  const {
    handleAuthorAnalysisResult,
    validateAndCleanAuthor
  } = useAuthorFormActions(
    currentAuthor,
    handleInputChange,
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  return {
    author: currentAuthor,
    handleInputChange,
    handleExperienceChange,
    addExperience,
    removeExperience,
    handleToneChange,
    addTone,
    removeTone,
    handleBeliefChange,
    addBelief,
    removeBelief,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink,
    handleAuthorAnalysisResult,
    validateAndCleanAuthor
  };
};

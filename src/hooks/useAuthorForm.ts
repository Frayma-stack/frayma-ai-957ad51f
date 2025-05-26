
import { Author } from '@/types/storytelling';
import { createInitialAuthor } from '@/utils/authorFormUtils';
import { useAuthorExperiences } from './useAuthorExperiences';
import { useAuthorTones } from './useAuthorTones';
import { useAuthorBeliefs } from './useAuthorBeliefs';
import { useAuthorSocialLinks } from './useAuthorSocialLinks';
import { useAuthorBasicInfo } from './useAuthorBasicInfo';
import { useAuthorState } from './useAuthorState';
import { useAuthorAnalysisIntegration } from './useAuthorAnalysisIntegration';
import { useAuthorFormValidation } from './useAuthorFormValidation';

export const useAuthorForm = (initialAuthor?: Author | null) => {
  const author = createInitialAuthor(initialAuthor);
  
  const { basicInfo, handleInputChange } = useAuthorBasicInfo(author);

  const {
    experiences,
    handleExperienceChange,
    addExperience,
    removeExperience,
    setExperiencesFromAnalysis
  } = useAuthorExperiences(author.experiences);

  const {
    tones,
    handleToneChange,
    addTone,
    removeTone,
    setTonesFromAnalysis
  } = useAuthorTones(author.tones);

  const {
    beliefs,
    handleBeliefChange,
    addBelief,
    removeBelief,
    setBeliefsFromAnalysis
  } = useAuthorBeliefs(author.beliefs);

  const {
    socialLinks,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  } = useAuthorSocialLinks(author.socialLinks || []);

  // Construct the current author state
  const currentAuthor = useAuthorState(basicInfo, experiences, tones, beliefs, socialLinks);

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

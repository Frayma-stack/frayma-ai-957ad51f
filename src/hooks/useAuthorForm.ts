
import { Author } from '@/types/storytelling';
import { createInitialAuthor } from '@/utils/authorFormUtils';
import { useAuthorExperiences } from './useAuthorExperiences';
import { useAuthorTones } from './useAuthorTones';
import { useAuthorBeliefs } from './useAuthorBeliefs';
import { useAuthorSocialLinks } from './useAuthorSocialLinks';
import { useAuthorBasicInfo } from './useAuthorBasicInfo';
import { useAuthorAnalysisHandler } from './useAuthorAnalysisHandler';
import { useAuthorValidation } from './useAuthorValidation';

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

  const { handleAuthorAnalysisResult } = useAuthorAnalysisHandler(
    // Pass setBasicInfo function from useAuthorBasicInfo
    (updater) => {
      if (typeof updater === 'function') {
        const currentBasicInfo = basicInfo;
        const newBasicInfo = updater(currentBasicInfo);
        handleInputChange('role', newBasicInfo.role);
        handleInputChange('organization', newBasicInfo.organization);
        handleInputChange('backstory', newBasicInfo.backstory);
      }
    },
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  const { validateAndCleanAuthor: validateAndCleanAuthorData } = useAuthorValidation();

  const validateAndCleanAuthor = () => {
    // Construct the full author object
    const fullAuthor: Author = {
      ...basicInfo,
      experiences,
      tones,
      beliefs,
      socialLinks
    };

    return validateAndCleanAuthorData(fullAuthor);
  };

  // Construct the current author state for components that need the full object
  const currentAuthor: Author = {
    ...basicInfo,
    experiences,
    tones,
    beliefs,
    socialLinks
  };

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

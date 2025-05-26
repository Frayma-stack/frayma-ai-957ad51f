
import { useState, useEffect } from 'react';
import { Author } from '@/types/storytelling';
import { createInitialAuthor } from '@/utils/authorFormUtils';
import { useAuthorBasicInfo } from './useAuthorBasicInfo';
import { useAuthorExperiences } from './useAuthorExperiences';
import { useAuthorTones } from './useAuthorTones';
import { useAuthorBeliefs } from './useAuthorBeliefs';
import { useAuthorSocialLinks } from './useAuthorSocialLinks';
import { useAuthorAnalysisHandler } from './useAuthorAnalysisHandler';
import { useAuthorValidation } from './useAuthorValidation';

export const useAuthorForm = (initialAuthor?: Author | null) => {
  const author = createInitialAuthor(initialAuthor);
  
  // Initialize all hooks with the initial author data
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

  // Compose the current author state directly
  const [currentAuthor, setCurrentAuthor] = useState<Author>({
    ...basicInfo,
    experiences,
    tones,
    beliefs,
    socialLinks
  });

  // Update the composed author state whenever any part changes
  useEffect(() => {
    setCurrentAuthor({
      ...basicInfo,
      experiences,
      tones,
      beliefs,
      socialLinks
    });
  }, [basicInfo, experiences, tones, beliefs, socialLinks]);

  // Handle analysis integration
  const { handleAuthorAnalysisResult } = useAuthorAnalysisHandler(
    handleInputChange,
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  // Handle validation
  const { validateAndCleanAuthor } = useAuthorValidation();

  const validateAndCleanCurrentAuthor = () => {
    return validateAndCleanAuthor(currentAuthor);
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
    validateAndCleanAuthor: validateAndCleanCurrentAuthor
  };
};

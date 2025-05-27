
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
import { useFormPersistence } from './useFormPersistence';

export const useAuthorForm = (initialAuthor?: Author | null) => {
  const author = createInitialAuthor(initialAuthor);
  
  // Use form persistence for the basic info
  const {
    values: persistedBasicInfo,
    updateValue: updatePersistedValue,
    clearPersistedData,
    isLoaded: isPersistenceLoaded
  } = useFormPersistence({
    key: initialAuthor ? `author_edit_${initialAuthor.id}` : 'author_new',
    defaultValues: {
      name: author.name,
      bio: author.bio,
      company: author.company,
      title: author.title,
      email: author.email
    }
  });

  // Initialize all hooks with the initial author data
  const { basicInfo, handleInputChange } = useAuthorBasicInfo(
    isPersistenceLoaded ? { ...author, ...persistedBasicInfo } : author
  );

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

  // Ensure we always start with a LinkedIn link for new authors
  const initialSocialLinks = author.socialLinks && author.socialLinks.length > 0 
    ? author.socialLinks 
    : [{ 
        id: crypto.randomUUID(), 
        type: 'linkedin' as const, 
        url: '' 
      }];

  const {
    socialLinks,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  } = useAuthorSocialLinks(initialSocialLinks);

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

  // Update persistence when basic info changes
  useEffect(() => {
    if (isPersistenceLoaded) {
      updatePersistedValue('name', basicInfo.name);
      updatePersistedValue('bio', basicInfo.bio);
      updatePersistedValue('company', basicInfo.company);
      updatePersistedValue('title', basicInfo.title);
      updatePersistedValue('email', basicInfo.email);
    }
  }, [basicInfo, updatePersistedValue, isPersistenceLoaded]);

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
    // Clear persisted data when form is submitted successfully
    clearPersistedData();
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
    validateAndCleanAuthor: validateAndCleanCurrentAuthor,
    clearPersistedData
  };
};

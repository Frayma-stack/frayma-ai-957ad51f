import { Author } from '@/types/storytelling';
import { createInitialAuthor } from '@/utils/authorFormUtils';
import { useAuthorBasicInfo } from './useAuthorBasicInfo';
import { useAuthorExperiences } from './useAuthorExperiences';
import { useAuthorTones } from './useAuthorTones';
import { useAuthorBeliefs } from './useAuthorBeliefs';
import { useAuthorSocialLinks } from './useAuthorSocialLinks';
import { useAuthorAnalysisHandler } from './useAuthorAnalysisHandler';
import { useAuthorFormPersistence } from './useAuthorFormPersistence';
import { useAuthorStateComposition } from './useAuthorStateComposition';
import { useAuthorFormValidation } from './useAuthorFormValidation';

export const useAuthorForm = (initialAuthor?: Author | null, selectedClientId?: string | null) => {
  // Create initial author with proper client assignment
  const author = createInitialAuthor(initialAuthor);
  
  // Ensure new authors get the selected client ID
  if (!initialAuthor && selectedClientId) {
    author.clientId = selectedClientId;
  }
  
  console.log('🏠 useAuthorForm initialized with:', { 
    hasInitialAuthor: !!initialAuthor, 
    authorId: author.id,
    authorName: author.name,
    selectedClientId,
    authorClientId: author.clientId,
    clientAssignment: author.clientId ? 'assigned_to_client' : 'no_client_assignment'
  });
  
  // Use form persistence for the basic info
  const {
    persistedBasicInfo,
    isPersistenceLoaded,
    clearPersistedData
  } = useAuthorFormPersistence(initialAuthor);

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

  // Compose the current author state
  const { currentAuthor } = useAuthorStateComposition({
    basicInfo,
    experiences,
    tones,
    beliefs,
    socialLinks,
    initialAuthor,
    selectedClientId
  });

  // Handle analysis integration
  const { handleAuthorAnalysisResult } = useAuthorAnalysisHandler(
    handleInputChange,
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  // Handle validation
  const { validateAndCleanCurrentAuthor } = useAuthorFormValidation(clearPersistedData);

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

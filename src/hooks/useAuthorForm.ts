
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Author, AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';
import { createInitialAuthor, validateAndCleanAuthor } from '@/utils/authorFormUtils';
import { useAuthorExperiences } from './useAuthorExperiences';
import { useAuthorTones } from './useAuthorTones';
import { useAuthorBeliefs } from './useAuthorBeliefs';
import { useAuthorSocialLinks } from './useAuthorSocialLinks';

export const useAuthorForm = (initialAuthor?: Author | null) => {
  const { toast } = useToast();
  const author = createInitialAuthor(initialAuthor);
  
  const [basicInfo, setBasicInfo] = useState({
    id: author.id,
    name: author.name,
    role: author.role,
    organization: author.organization,
    backstory: author.backstory
  });

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
  
  const handleInputChange = (
    field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, 
    value: string
  ) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthorAnalysisResult = (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: AuthorExperience[];
    tones?: AuthorToneItem[];
    beliefs?: AuthorBelief[];
  }) => {
    // Update basic info
    setBasicInfo(prev => ({
      ...prev,
      role: results.currentRole || prev.role,
      organization: results.organization || prev.organization,
      backstory: results.backstory || prev.backstory
    }));

    // Update arrays if provided
    if (results.experiences) setExperiencesFromAnalysis(results.experiences);
    if (results.tones) setTonesFromAnalysis(results.tones);
    if (results.beliefs) setBeliefsFromAnalysis(results.beliefs);

    // Show success message with what was extracted
    const extractedItems = [];
    if (results.currentRole) extractedItems.push('role');
    if (results.organization) extractedItems.push('organization');
    if (results.backstory) extractedItems.push('backstory');
    if (results.experiences && results.experiences.length > 0) extractedItems.push(`${results.experiences.length} experiences`);
    if (results.tones && results.tones.length > 0) extractedItems.push(`${results.tones.length} writing tones`);
    if (results.beliefs && results.beliefs.length > 0) extractedItems.push(`${results.beliefs.length} product beliefs`);
    
    if (extractedItems.length > 0) {
      toast({
        title: "Profile analysis complete!",
        description: `Successfully auto-filled: ${extractedItems.join(', ')}.`,
      });
    }
  };

  const validateAndCleanAuthorData = () => {
    // Basic validation
    if (!basicInfo.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this author.",
        variant: "destructive"
      });
      return null;
    }
    
    // Construct the full author object
    const fullAuthor: Author = {
      ...basicInfo,
      experiences,
      tones,
      beliefs,
      socialLinks
    };

    return validateAndCleanAuthor(fullAuthor);
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
    validateAndCleanAuthor: validateAndCleanAuthorData
  };
};

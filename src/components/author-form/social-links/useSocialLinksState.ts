
import { useState } from 'react';
import { Author } from '@/types/storytelling';

export const useSocialLinksState = (author: Author) => {
  const [stepOneCompleted, setStepOneCompleted] = useState(false);
  
  // Check if we have LinkedIn URL for step 1
  const linkedInLink = (author.socialLinks || []).find(link => link.type === 'linkedin');
  const hasLinkedInUrl = linkedInLink && linkedInLink.url.trim() !== '';
  
  // Check if we have other URLs for step 2
  const otherLinks = (author.socialLinks || []).filter(link => link.type !== 'linkedin' && link.url.trim() !== '');
  const hasOtherUrls = otherLinks.length > 0;
  
  // Check if step 1 analysis has been completed (has basic info from LinkedIn)
  // Convert to boolean explicitly to avoid string | boolean type
  const hasStepOneResults = Boolean(
    author.role || 
    author.organization || 
    author.experiences.some(exp => exp.title || exp.description)
  );

  return {
    stepOneCompleted,
    setStepOneCompleted,
    hasLinkedInUrl,
    hasOtherUrls,
    hasStepOneResults,
    linkedInLink
  };
};

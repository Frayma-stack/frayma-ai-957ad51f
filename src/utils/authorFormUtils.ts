
import { 
  AuthorExperience, 
  AuthorToneItem, 
  AuthorBelief,
  AuthorSocialLink,
  Author
} from '@/types/storytelling';

// Helper functions to create empty items with unique IDs
export const createEmptyExperience = (): AuthorExperience => ({
  id: crypto.randomUUID(),
  title: '',
  description: ''
});

export const createEmptyTone = (): AuthorToneItem => ({
  id: crypto.randomUUID(),
  tone: '',
  description: ''
});

export const createEmptyBelief = (): AuthorBelief => ({
  id: crypto.randomUUID(),
  belief: '',
  description: ''
});

export const createEmptySocialLink = (): AuthorSocialLink => ({
  id: crypto.randomUUID(),
  type: 'linkedin',
  url: ''
});

export const createInitialAuthor = (initialAuthor?: Author | null): Author => {
  return initialAuthor || {
    id: crypto.randomUUID(),
    name: '',
    bio: '',
    company: '',
    title: '',
    email: '',
    role: '',
    organization: '',
    backstory: '',
    experiences: [createEmptyExperience()],
    tones: [createEmptyTone()],
    beliefs: [createEmptyBelief()],
    socialLinks: [createEmptySocialLink()]
  };
};

export const validateAndCleanAuthor = (author: Author): Author | null => {
  console.log('validateAndCleanAuthor called with:', {
    name: author.name,
    role: author.role,
    organization: author.organization,
    backstory: author.backstory
  });

  // Validate required fields
  if (!author.name.trim()) {
    console.error('Author validation failed: name is required');
    return null;
  }

  // Set default values for required fields
  const cleanedAuthor: Author = {
    ...author,
    name: author.name.trim(),
    role: author.role || 'Professional',
    organization: author.organization || 'Unknown Organization',
    backstory: author.backstory || 'Professional background to be updated.',
    experiences: author.experiences?.filter(exp => exp.title.trim() !== '' || exp.description.trim() !== '') || [],
    tones: author.tones?.filter(tone => tone.tone.trim() !== '') || [],
    beliefs: author.beliefs?.filter(belief => belief.belief.trim() !== '') || [],
    socialLinks: author.socialLinks?.filter(link => link.url.trim() !== '') || []
  };

  // Ensure we have at least one item in each array if they're empty
  if (cleanedAuthor.experiences.length === 0) {
    cleanedAuthor.experiences = [{ id: crypto.randomUUID(), title: 'To be updated', description: 'Professional experience to be added.' }];
  }
  if (cleanedAuthor.tones.length === 0) {
    cleanedAuthor.tones = [{ id: crypto.randomUUID(), tone: 'Professional', description: 'Professional communication style' }];
  }
  if (cleanedAuthor.beliefs.length === 0) {
    cleanedAuthor.beliefs = [{ id: crypto.randomUUID(), belief: 'Quality matters', description: 'Believes in delivering quality work' }];
  }

  console.log('Cleaned author result:', {
    name: cleanedAuthor.name,
    role: cleanedAuthor.role,
    organization: cleanedAuthor.organization,
    backstory: cleanedAuthor.backstory,
    experiencesCount: cleanedAuthor.experiences.length,
    tonesCount: cleanedAuthor.tones.length,
    beliefsCount: cleanedAuthor.beliefs.length,
    socialLinksCount: cleanedAuthor.socialLinks.length
  });
  
  return cleanedAuthor;
};


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

export const validateAndCleanAuthor = (author: Author) => {
  // Clean up empty items
  const cleanedAuthor = {
    ...author,
    experiences: author.experiences.filter(exp => exp.title.trim() !== '' || exp.description.trim() !== ''),
    tones: author.tones.filter(tone => tone.tone.trim() !== ''),
    beliefs: author.beliefs.filter(belief => belief.belief.trim() !== ''),
    socialLinks: author.socialLinks?.filter(link => link.url.trim() !== '') || undefined
  };
  
  // Make sure each array has at least one item
  if (cleanedAuthor.experiences.length === 0) cleanedAuthor.experiences = [createEmptyExperience()];
  if (cleanedAuthor.tones.length === 0) cleanedAuthor.tones = [createEmptyTone()];
  if (cleanedAuthor.beliefs.length === 0) cleanedAuthor.beliefs = [createEmptyBelief()];
  
  return cleanedAuthor;
};

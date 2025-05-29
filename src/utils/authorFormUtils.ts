
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
  console.log('🔧 createInitialAuthor called with:', {
    hasInitialAuthor: !!initialAuthor,
    initialAuthorName: initialAuthor?.name,
    initialAuthorId: initialAuthor?.id
  });
  
  if (initialAuthor) {
    console.log('🔧 Using provided initialAuthor');
    return initialAuthor;
  }
  
  const newAuthor = {
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
  
  console.log('🔧 Created new author with ID:', newAuthor.id);
  return newAuthor;
};

export const validateAndCleanAuthor = (author: Author): Author | null => {
  console.log('🔧 validateAndCleanAuthor called with:', {
    id: author?.id || 'undefined',
    name: author?.name || 'undefined',
    role: author?.role || 'undefined',
    organization: author?.organization || 'undefined'
  });

  // Safety check for null/undefined author
  if (!author) {
    console.error('🔧 Author validation failed: author object is null or undefined');
    return null;
  }

  // Validate required fields
  if (!author.name?.trim()) {
    console.error('🔧 Author validation failed: name is required');
    return null;
  }

  // Set default values for required fields
  const cleanedAuthor: Author = {
    ...author,
    id: author.id || crypto.randomUUID(), // Ensure ID exists
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

  console.log('🔧 Cleaned author result:', {
    id: cleanedAuthor.id,
    name: cleanedAuthor.name,
    role: cleanedAuthor.role,
    organization: cleanedAuthor.organization,
    experiencesCount: cleanedAuthor.experiences.length,
    tonesCount: cleanedAuthor.tones.length,
    beliefsCount: cleanedAuthor.beliefs.length,
    socialLinksCount: cleanedAuthor.socialLinks.length
  });
  
  return cleanedAuthor;
};
